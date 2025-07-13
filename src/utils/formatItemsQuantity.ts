const formatItemsQuantity = (quantity: number) => {
  if (quantity === 1) {
    return `${quantity} item`
  } else {
    return `${quantity} itens`
  }
}

export default formatItemsQuantity
