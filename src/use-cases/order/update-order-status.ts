/**
 * Update order status use case
 */
import { OrderRepository } from '../../repositories/OrderRepository';
import { ClientRepository } from '../../repositories/ClientRepository';
import { EOrderStatus } from '../../types/orders/IOrder';

/**
 * Update the status of an existing order
 * 
 * @param orderId - Order ID
 * @param status - New order status
 * @param clientId - Client ID from the request header
 * @param cancellationReason - Optional reason for cancellation if status is a cancellation type
 * @returns The updated order
 */
export async function updateOrderStatus(
  orderId: string, 
  status: EOrderStatus, 
  clientId: string,
  cancellationReason?: string
) {
  // Validate that the client exists
  const clientRepository = new ClientRepository();
  const client = await clientRepository.findById(clientId);
  if (!client) {
    throw new Error(`Client with ID ${clientId} not found`);
  }
  
  // Validate that the order exists and belongs to the client
  const orderRepository = new OrderRepository();
  const order = await orderRepository.findById(orderId);
  if (!order) {
    throw new Error(`Order with ID ${orderId} not found`);
  }
  
  if (order.clientId !== clientId) {
    throw new Error(`Order with ID ${orderId} does not belong to client ${clientId}`);
  }
  
  // Prepare update data with timestamp for the specific status change
  const updateData: Record<string, any> = {
    status
  };
  
  // Add timestamp based on the status
  switch (status) {
    case EOrderStatus.WAITING_MERCHANT_ACCEPTANCE:
      updateData.sentToWaitingMerchantAcceptanceAt = new Date();
      break;
    case EOrderStatus.PENDING_PAYMENT:
      updateData.sentToPendingPaymentAt = new Date();
      break;
    case EOrderStatus.IN_PREPARATION:
      updateData.sentToInPreparationAt = new Date();
      break;
    case EOrderStatus.READY_FOR_DELIVERY:
      updateData.sentToReadyForDeliveryAt = new Date();
      break;
    case EOrderStatus.IN_DELIVERY:
      updateData.sentToInDeliveryAt = new Date();
      break;
    case EOrderStatus.DRIVER_ON_CLIENT:
      updateData.sentToDriverOnClientAt = new Date();
      break;
    case EOrderStatus.COMPLETED:
      updateData.sentToCompletedAt = new Date();
      break;
    case EOrderStatus.CANCELED_BY_MERCHANT:
      updateData.sentToCanceledByMerchantAt = new Date();
      if (cancellationReason) {
        updateData.cancellationReason = cancellationReason;
      }
      break;
    case EOrderStatus.CANCELED_BY_USER:
      updateData.sentToCanceledByUserAt = new Date();
      if (cancellationReason) {
        updateData.cancellationReason = cancellationReason;
      }
      break;
    case EOrderStatus.REJECTED_BY_MERCHANT:
      updateData.sentToRejectedByMerchantAt = new Date();
      if (cancellationReason) {
        updateData.cancellationReason = cancellationReason;
      }
      break;
    case EOrderStatus.PAYMENT_FAILED:
      updateData.sentToPaymentFailedAt = new Date();
      break;
    case EOrderStatus.EXPIRED:
      updateData.sentToExpiredAt = new Date();
      break;
  }
  
  // Update the order in the database
  const updatedOrder = await orderRepository.update(orderId, updateData);
  
  return {
    order: updatedOrder,
    message: 'Order status updated successfully'
  };
}
