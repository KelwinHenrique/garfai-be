/**
 * Get order by flow ID and client ID use case
 */

import { OrderRepository } from '../../repositories/OrderRepository';
import { OrderItemRepository } from '../../repositories/OrderItemRepository';
import { eq, and } from 'drizzle-orm';
import { db } from '../../config/database';
import { orders } from '../../schemas/orders.schema';
import { Order } from '../../models/order';

/**
 * Get an order with its items by flow ID and client ID
 * 
 * @param flowId - Whatsapp Flow ID
 * @param clientId - Client ID
 * @returns The order with its items or null if not found
 */
export async function getOrderByFlowAndClient(flowId: string, clientId: string) {
  // Find the order that matches both flowId and clientId
  const orderResults = await db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.whatsappFlowsId, flowId),
        eq(orders.clientId, clientId)
      )
    )
    .limit(1);

  // If no order found, return null
  if (orderResults.length === 0) {
    return null;
  }

  const order = orderResults[0] as unknown as Order;
  
  // Get the order items
  const orderItemRepository = new OrderItemRepository();
  const items = await orderItemRepository.findByOrderId(order.id);
  
  // Return the order with its items
  return {
    ...order,
    items
  };
}
