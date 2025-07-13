/**
 * Order Item repository
 * 
 * Handles database operations for order item entities
 */

import { eq } from 'drizzle-orm';
import { db } from '../config/database';
import { orderItems, NewOrderItem, OrderItem } from '../schemas/orderItems.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

/**
 * Order Item repository class
 */
export class OrderItemRepository {
  /**
   * Create a new order item in the database
   * 
   * @param orderItemData - Order item data
   * @param tx - Optional database transaction
   * @returns The created order item
   */
  async create(orderItemData: NewOrderItem, tx?: PostgresJsDatabase): Promise<OrderItem> {
    const dbInstance = tx || db;
    const [insertedOrderItem] = await dbInstance.insert(orderItems).values(orderItemData).returning();
    return insertedOrderItem;
  }

  /**
   * Get order items by order ID from the database
   * 
   * @param orderId - Order ID
   * @returns Array of order items
   */
  async findByOrderId(orderId: string): Promise<OrderItem[]> {
    return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }
}
