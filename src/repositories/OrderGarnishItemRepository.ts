/**
 * Order Garnish Item repository
 * 
 * Handles database operations for order garnish item entities
 */

import { eq } from 'drizzle-orm';
import { db } from '../config/database';
import { orderGarnishItems, NewOrderGarnishItems, OrderGarnishItems } from '../schemas/orderGarnishItems.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

/**
 * Order Garnish Item repository class
 */
export class OrderGarnishItemRepository {
  /**
   * Create a new order garnish item in the database
   * 
   * @param orderGarnishItemData - Order garnish item data
   * @param tx - Optional database transaction
   * @returns The created order garnish item
   */
  async create(orderGarnishItemData: NewOrderGarnishItems, tx?: PostgresJsDatabase): Promise<OrderGarnishItems> {
    const dbInstance = tx || db;
    const [insertedOrderGarnishItem] = await dbInstance.insert(orderGarnishItems).values(orderGarnishItemData).returning();
    return insertedOrderGarnishItem;
  }

  /**
   * Get order garnish items by order choice ID from the database
   * 
   * @param orderChoiceId - Order choice ID
   * @returns Array of order garnish items
   */
  async findByOrderChoiceId(orderChoiceId: string): Promise<OrderGarnishItems[]> {
    return db.select().from(orderGarnishItems).where(eq(orderGarnishItems.orderChoiceId, orderChoiceId));
  }
}
