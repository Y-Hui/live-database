const checkDate = (value?: unknown): value is Date => {
  return typeof value === 'string'
}

checkDate.extends = () => {
  return (value?: unknown): value is Date => {
    if (!checkDate(value)) {
      return false
    }
    return false
  }
}

export default checkDate
