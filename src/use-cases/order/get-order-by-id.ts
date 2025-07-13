/**
 * Get order by ID use case
 */

import { OrderRepository } from '../../repositories/OrderRepository';

/**
 * Get an order by its ID
 * 
 * @param id - Order ID
 * @returns The order or null if not found
 */
export async function getOrderById(id: string) {
  const orderRepository = new OrderRepository();
  return orderRepository.findById(id);
}
