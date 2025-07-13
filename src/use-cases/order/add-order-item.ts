/**
 * Add item to order use case
 */

import { db } from '../../config/database';
import { OrderRepository } from '../../repositories/OrderRepository';
import { OrderItemRepository } from '../../repositories/OrderItemRepository';
import { OrderChoiceRepository } from '../../repositories/OrderChoiceRepository';
import { OrderGarnishItemRepository } from '../../repositories/OrderGarnishItemRepository';
import { IAddItemBody, IChoiceBody } from '../../handlers/order/add-order-item';
import { ClientRepository } from '../../repositories/ClientRepository';
import { items } from '../../schemas/items.schema';
import { eq } from 'drizzle-orm';
import { choices } from '../../schemas/choices.schema';
import { garnishItems } from '../../schemas/garnishItems.schema';

/**
 * Add an item to an existing order
 * 
 * @param orderId - Order ID
 * @param itemData - Item data to add
 * @param clientId - Client ID from the request header
 * @returns The added order item with its choices
 */
export async function addOrderItem(orderId: string, itemData: IAddItemBody, clientId: string) {
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
  
  // Validate that the item exists
  const [menuItem] = await db.select().from(items).where(eq(items.id, itemData.itemId)).limit(1);
  if (!menuItem) {
    throw new Error(`Item with ID ${itemData.itemId} not found`);
  }
  
  // Create order item in database using a transaction
  const orderItemRepository = new OrderItemRepository();
  const orderChoiceRepository = new OrderChoiceRepository();
  const orderGarnishItemRepository = new OrderGarnishItemRepository();
  
  return await db.transaction(async (tx) => {
    // Create order item
    const orderItemData = {
      environmentId: order.environmentId,
      orderId: orderId,
      itemId: itemData.itemId,
      quantity: itemData.quantity,
      notes: itemData.notes || null,
      // Snapshot item data
      descriptionAtPurchase: menuItem.description,
      detailsAtPurchase: menuItem.details,
      logoUrlAtPurchase: menuItem.logoUrl,
      unitPriceAtPurchase: menuItem.unitPrice,
      unitMinPriceAtPurchase: menuItem.unitMinPrice,
      unitOriginalPriceAtPurchase: menuItem.unitOriginalPrice,
      // Initialize prices
      singlePriceForItemLine: menuItem.unitPrice,
      totalPriceForItemLine: menuItem.unitPrice * itemData.quantity
    };
    
    const createdOrderItem = await orderItemRepository.create(orderItemData, tx);
    
    const orderAmount = await orderRepository.updateAmount(orderId, order.subtotalAmount + (itemData.quantity * menuItem.unitPrice), tx);
    
    // Process choices if provided
    if (itemData.choices && itemData.choices.length > 0) {
      for (const choiceData of itemData.choices) {
        // Validate that the choice exists
        const [menuChoice] = await tx.select().from(choices).where(eq(choices.id, choiceData.choiceId)).limit(1);
        if (!menuChoice) {
          throw new Error(`Choice with ID ${choiceData.choiceId} not found`);
        }
        
        // Create order choice
        const orderChoiceData = {
          environmentId: order.environmentId,
          orderItemId: createdOrderItem.id,
          choiceId: choiceData.choiceId,
          nameAtPurchase: menuChoice.name,
          minAtPurchase: menuChoice.min,
          maxAtPurchase: menuChoice.max
        };
        
        const createdOrderChoice = await orderChoiceRepository.create(orderChoiceData, tx);
        
        // Validate that the option exists

        for (const garnishItem of choiceData.garnishItems) {
          const [menuOption] = await tx.select().from(garnishItems).where(eq(garnishItems.id, garnishItem.garnishId)).limit(1);
          if (!menuOption) {
            throw new Error(`Option with ID ${garnishItem.garnishId} not found`);
          }
          const orderGarnishItemData = {
            environmentId: order.environmentId,
            orderChoiceId: createdOrderChoice.id,
            garnishItemId: garnishItem.garnishId,
            descriptionAtPurchase: menuOption.description,
            detailsAtPurchase: menuOption.details,
            unitPriceAtPurchase: menuOption.unitPrice,
            logoUrlAtPurchase: menuOption.logoUrl,
            quantity: garnishItem.quantity,
            totalPriceForGarnishItemLine: menuOption.unitPrice * garnishItem.quantity
          };
          
          await orderGarnishItemRepository.create(orderGarnishItemData, tx);
        }
        
      }
    }
    
    // Recalculate order total (this would be a separate function in a real application)
    // For now, we'll just return the created order item
    return {
      orderItem: createdOrderItem,
      message: 'Item added to order successfully'
    };
  });
}
