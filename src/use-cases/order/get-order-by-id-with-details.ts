/**
 * Get order by ID with all details use case
 */

import { OrderRepository } from '../../repositories/OrderRepository';
import { OrderItemRepository } from '../../repositories/OrderItemRepository';
import { OrderChoiceRepository } from '../../repositories/OrderChoiceRepository';
import { OrderGarnishItemRepository } from '../../repositories/OrderGarnishItemRepository';
import { ClientRepository } from '../../repositories/ClientRepository';

/**
 * Get an order by its ID with all related data populated
 * 
 * @param id - Order ID
 * @returns The order with all details or null if not found
 */
export async function getOrderByIdWithDetails(id: string) {
  const orderRepository = new OrderRepository();
  const orderItemRepository = new OrderItemRepository();
  const orderChoiceRepository = new OrderChoiceRepository();
  const orderGarnishItemRepository = new OrderGarnishItemRepository();
  const clientRepository = new ClientRepository();
  
  // Get the order
  const order = await orderRepository.findById(id);
  
  if (!order) {
    return null;
  }
  
  // Get client data for this order
  const client = await clientRepository.findById(order.clientId);
  
  // Get order items for this order
  const orderItems = await orderItemRepository.findByOrderId(order.id);
  
  // For each order item, get its choices
  const itemsWithDetails = await Promise.all(orderItems.map(async (item) => {
    const choices = await orderChoiceRepository.findByOrderItemId(item.id);
    
    // For each choice, get its garnish items
    const choicesWithGarnishItems = await Promise.all(choices.map(async (choice) => {
      const garnishItems = await orderGarnishItemRepository.findByOrderChoiceId(choice.id);
      return {
        ...choice,
        garnishItems
      };
    }));
    
    return {
      ...item,
      choices: choicesWithGarnishItems
    };
  }));
  
  // Return the order with all its details
  return {
    ...order,
    client,
    items: itemsWithDetails
  };
} 