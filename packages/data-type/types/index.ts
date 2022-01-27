/**
 * 定义类型校验函数
 */
export type TypeCheckFn<T> = (value?: unknown) => value is T

/**
 * 带有扩展功能的类型校验函数
 */
export type TypeCheckFnWithExtends<T> = {
  (value?: unknown): value is T
  extends: () => TypeCheckFn<T>
}
