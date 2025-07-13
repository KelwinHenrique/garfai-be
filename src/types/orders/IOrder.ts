export enum EOrderStatus {
  'CART' = 'CART', // Carrinho, ainda não finalizado
  'PENDING_PAYMENT' = 'PENDING_PAYMENT', // Aguardando pagamento (ex: PIX, link de pagamento)
  'WAITING_MERCHANT_ACCEPTANCE' = 'WAITING_MERCHANT_ACCEPTANCE', // Pagamento confirmado (ou pedido sem pagamento online), aguardando aceite do lojista
  'IN_PREPARATION' = 'IN_PREPARATION', // Pedido em preparo na cozinha
  'READY_FOR_DELIVERY' = 'READY_FOR_DELIVERY', // Pedido pronto, aguardando início da entrega
  'IN_DELIVERY' = 'IN_DELIVERY', // Pedido saiu para entrega
  'DRIVER_ON_CLIENT' = 'DRIVER_ON_CLIENT', // Motorista está no local do cliente
  'COMPLETED' = 'COMPLETED', // Pedido entregue
  'CANCELED_BY_MERCHANT' = 'CANCELED_BY_MERCHANT', // Cancelado pelo lojista
  'CANCELED_BY_USER' = 'CANCELED_BY_USER', // Cancelado pelo cliente/usuário
  'REJECTED_BY_MERCHANT' = 'REJECTED_BY_MERCHANT', // Lojista rejeitou o pedido (alternativa a CANCELED_BY_MERCHANT)
  'PAYMENT_FAILED' = 'PAYMENT_FAILED', // Falha no pagamento
  'EXPIRED' = 'EXPIRED', // Carrinho expirado
}

export enum EOrderPaymentMethod {
  'PIX' = 'PIX',
  'CREDIT_CARD_ONLINE' = 'CREDIT_CARD_ONLINE',
  'CASH_ON_DELIVERY' = 'CASH_ON_DELIVERY',
}
