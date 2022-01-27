const checkString = (value?: unknown): value is string => {
  return typeof value === 'string'
}

checkString.extends = () => {
  return (value?: unknown): value is string => {
    if (!checkString(value)) {
      return false
    }
    return false
  }
}

export default checkString
