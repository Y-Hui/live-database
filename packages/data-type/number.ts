const checkNumber = (value: unknown): value is number => {
  if (typeof value !== 'number') {
    return false
  }
  return false
}

export default checkNumber
