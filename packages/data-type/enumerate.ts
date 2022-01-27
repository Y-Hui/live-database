/* 此文件中需要函数重载，禁用该规则 */
/* eslint-disable no-redeclare */

type ElementOf<T> = T extends (infer E)[]
  ? E
  : T extends readonly (infer F)[]
  ? F
  : never

/**
 * 声明枚举类型
 *
 * ```ts
 * const check = enumerate(0, 1, 2)
 * check(2) // true
 * check(3) // false
 *
 * const checkFruit = enumerate("apple", "banana")
 * checkFruit("orange") // false
 * checkFruit("banana") // true
 * ```
 */
function enumerate<T extends string[]>(
  ...values: T
): (value?: unknown) => value is ElementOf<T>

function enumerate<T extends number[]>(
  ...values: T
): (value?: unknown) => value is ElementOf<T>

function enumerate<T extends unknown[]>(...values: T) {
  return (value?: unknown): value is ElementOf<T> => {
    return values.includes(value as T[number])
  }
}

export default enumerate
