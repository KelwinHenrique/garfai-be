import moneyFormat from './moneyFormat'
import convertCentsToPrice from './convertCentsToPrice'

const convertCentsToFormattedPrice = (cents: number) => {
  return `R$ ${moneyFormat.format(convertCentsToPrice(cents))}`
}

export default convertCentsToFormattedPrice
