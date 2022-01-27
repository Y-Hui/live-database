/**
 * 判断是否为普通对象
 *
 * ```ts
 * isPlainObject({})   // true
 *
 * isPlainObject()     // false
 * isPlainObject(null) // false
 * isPlainObject([])   // false
 * ```
 */
function isPlainObject<T = Record<PropertyKey, unknown>>(
  val?: unknown | null,
): val is T {
  return Object.prototype.toString.call(val) === '[object Object]'
}

export default isPlainObject
