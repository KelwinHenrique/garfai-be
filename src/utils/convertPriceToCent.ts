const convertPriceToCent = (price: number) => {
  return Number(price.toFixed(2).replace('.', ''))
}

export default convertPriceToCent
