/**
 * Order Choice repository
 * 
 * Handles database operations for order choice entities
 */

import { eq } from 'drizzle-orm';
import { db } from '../config/database';
import { orderChoices, NewOrderChoice, OrderChoice } from '../schemas/orderChoices.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

/**
 * Order Choice repository class
 */
export class OrderChoiceRepository {
  /**
   * Create a new order choice in the database
   * 
   * @param orderChoiceData - Order choice data
   * @param tx - Optional database transaction
   * @returns The created order choice
   */
  async create(orderChoiceData: NewOrderChoice, tx?: PostgresJsDatabase): Promise<OrderChoice> {
    const dbInstance = tx || db;
    const [insertedOrderChoice] = await dbInstance.insert(orderChoices).values(orderChoiceData).returning();
    return insertedOrderChoice;
  }

  /**
   * Get order choices by order item ID from the database
   * 
   * @param orderItemId - Order item ID
   * @returns Array of order choices
   */
  async findByOrderItemId(orderItemId: string): Promise<OrderChoice[]> {
    return db.select().from(orderChoices).where(eq(orderChoices.orderItemId, orderItemId));
  }
}
