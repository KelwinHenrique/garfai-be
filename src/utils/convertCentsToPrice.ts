const convertCentsToPrice = (cents: number) => {
  return Number((cents / 100).toFixed(2))
}

export default convertCentsToPrice
