export default function getDefaultValue<T>(param?: T | (() => T)) {
  if (param === undefined || param === null) {
    return null
  }
  if (typeof param === 'function') {
    return (param as () => T)()
  }
  return param
}
