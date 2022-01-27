import { DefaultValue } from './cdk'

/**
 * 类型校验函数
 */
export type TypeValidator = (value?: unknown) => boolean

/**
 * 定义类型校验函数
 */
export type TypeCheckFn<T> = (value: unknown) => value is T

/**
 * 类型谓词推导
 */
export type TypePredicate<T> = T extends (val: unknown) => val is infer P
  ? P
  : unknown

/**
 * 类型中 required 是否为 true
 */
type IsRequired<T, R> = T extends { required: true } ? R : never

/**
 * 提取必填参数 key
 *
 * 数据安全版
 */
export type RequiredKeys<T> = {
  [K in keyof T]: T[K] extends { required: true } | { defaultValue: any }
    ? T[K] extends {
        defaultValue: undefined | (() => undefined)
      }
      ? never
      : K
    : never
}[keyof T]

/**
 * 提取可选参数 key
 */
export type OptionalKeys<T> = Exclude<keyof T, RequiredKeys<T>>

/**
 * 提取必填参数 key
 *
 * defaultValue 不为 undefined 时被归为可选参数
 */
export type RequiredKeysRunTime<T> = {
  [K in keyof T]: T[K] extends { defaultValue: infer D }
    ? D extends undefined
      ? IsRequired<T[K], K>
      : never
    : IsRequired<T[K], K>
}[keyof T]

export type OptionalKeysRunTime<T> = Exclude<keyof T, RequiredKeysRunTime<T>>

/**
 * 数据表配置
 */
export interface DataTableConfig<T = unknown> {
  type: TypeValidator
  required?: boolean
  defaultValue?: DefaultValue<T>
  transform?: (val: unknown) => T
}
