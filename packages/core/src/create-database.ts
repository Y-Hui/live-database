import create, { Store } from '@live-database/store'

import selector from '../../store/src/middleware/selector'
import {
  DataTableConfig,
  OptionalKeys,
  OptionalKeysRunTime,
  RequiredKeys,
  RequiredKeysRunTime,
  TypePredicate,
} from './types'
import mergeData from './utils/mergeData'

/**
 * 处理类型
 */
type ReflectType<T> = T extends { type: infer R } ? TypePredicate<R> : unknown

type ExtractTypesRunTime<O> = {
  [K in keyof Pick<O, RequiredKeysRunTime<O>>]: ReflectType<O[K]>
} & {
  [K in keyof Pick<O, OptionalKeysRunTime<O>>]?: ReflectType<O[K]>
}

type ExtractTypes<O> = {
  [K in keyof Pick<O, RequiredKeys<O>>]: ReflectType<O[K]>
} & {
  [K in keyof Pick<O, OptionalKeys<O>>]: ReflectType<O[K]> | null
}

interface CreateTableParams<T extends Record<string, DataTableConfig>> {
  name: string
  primaryKey: string
  body: T
}

function createDatabase() {
  const database = new Map<string, Store<Map<string, object>>>()

  return {
    createTable<T extends Readonly<Record<string, DataTableConfig>>>(
      params: CreateTableParams<T>,
    ) {
      const { name, primaryKey, body } = params || {}
      const store = create(new Map<string, ExtractTypes<T>>()).extend(
        selector(),
      )
      // TODO:
      database.set(name, store as unknown as Store<Map<string, object>>)

      return {
        insert(value: ExtractTypesRunTime<T>) {
          if (!Reflect.has(value, primaryKey)) {
            console.error(
              `[live-database]: datatable \`${name}\` primaryKey is missing when inserting data.`,
            )
            return
          }
          try {
            const res = mergeData({
              dataTableConfig: body,
              data: value,
            })
            store.setState((rawState) => {
              rawState.set(
                Reflect.get(value, primaryKey) as string,
                res as Record<string, unknown> as ExtractTypes<T>,
              )
              return rawState
            })
            store.notify()
          } catch (error) {
            if (error instanceof Error) {
              console.error(
                `[live-database] "${name}" table: ${error.message} when inserting data.`,
              )
            } else {
              console.error(error)
            }
          }
        },
        query: store.getState,
        queryByPrimaryKey: (key: string) => store.getState().get(key),
        selector: store.selector,
      }
    },
  }
}

export default createDatabase
