import { DataTableConfig } from '../types'
import getDefaultValue from './getDefaultValue'

interface MergeDataOption<T> {
  /**
   * 数据配置
   */
  dataTableConfig: Record<string, DataTableConfig>
  /**
   * 数据
   */
  data: T
  /**
   * 错误处理
   */
  // onError: (errorDescription: string) => void
}

export default function mergeData<T extends Record<string, unknown>>(
  params: MergeDataOption<T>,
) {
  const { dataTableConfig, data } = params
  const res = {} as Required<T>

  Object.keys(dataTableConfig).forEach((item) => {
    const { defaultValue, required, type: checker } = dataTableConfig[item]
    let value: unknown
    if (Reflect.has(data, item)) {
      const val = Reflect.get(data, item)
      if (checker(val)) {
        value = val
      } else {
        throw TypeError(`field "${item}" type validation failed`)
      }
    } else if (required && defaultValue === undefined) {
      throw TypeError(`field "${item}" is required`)
    } else {
      value = getDefaultValue(defaultValue)
    }
    Reflect.set(res, item, value)
  })

  return res
}
