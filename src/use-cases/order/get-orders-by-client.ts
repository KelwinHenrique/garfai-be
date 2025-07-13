/**
 * Get orders by client ID use case
 */

import { OrderRepository } from '../../repositories/OrderRepository';

/**
 * Get orders by client ID
 * 
 * @param clientId - Client ID
 * @returns Array of orders for the client
 */
export async function getOrdersByClient(clientId: string) {
  const orderRepository = new OrderRepository();
  return orderRepository.findByClientId(clientId);
}
