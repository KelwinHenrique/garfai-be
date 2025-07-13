/**
 * Order repository
 * 
 * Handles database operations for order entities
 */

import { eq } from 'drizzle-orm';
import { db } from '../config/database';
import { orders } from '../schemas/orders.schema';
import { Order } from '../models/order';
import { EOrderStatus } from '../types/orders/IOrder';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

/**
 * Order repository class
 */
export class OrderRepository {
  /**
   * Create a new order in the database
   * 
   * @param orderData - Order creation data
   * @param clientId - Client ID from the request header
   * @param tx - Optional database transaction
   * @returns The created order
   */
  async create(orderData: {
    whatsappFlowsId: string;
    environmentId: string;
    clientAddressId: string;
  }, clientId: string, tx?: PostgresJsDatabase): Promise<Order> {
    const now = new Date();
    const dbInstance = tx || db;
    
    // Usando os nomes dos campos conforme definidos no schema
    const orderToInsert = {
      environmentId: orderData.environmentId,
      clientId: clientId,
      whatsappFlowsId: orderData.whatsappFlowsId,
      status: EOrderStatus.CART,
      subtotalAmount: 0,
      discountAmount: 0,
      deliveryFeeAmount: 0,
      totalAmount: 0,
      clientAddressId: orderData.clientAddressId,
      createdAt: now,
      updatedAt: now
    };
    
    const [insertedOrder] = await dbInstance.insert(orders).values(orderToInsert).returning();
    return insertedOrder as unknown as Order;
  }
  
  /**
   * Get an order by ID from the database
   * 
   * @param id - Order ID
   * @returns The order or null if not found
   */
  async findById(id: string): Promise<Order | null> {
    const results = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    return results.length > 0 ? results[0] as unknown as Order : null;
  }
  
  /**
   * Get orders by client ID from the database
   * 
   * @param clientId - Client ID
   * @returns Array of orders
   */
  async findByClientId(clientId: string): Promise<Order[]> {
    return db.select().from(orders).where(eq(orders.clientId, clientId)) as unknown as Promise<Order[]>;
  }

  /**
   * Update an order in the database
   * 
   * @param id - Order ID
   * @param updateData - Data to update
   * @param tx - Optional database transaction
   * @returns The updated order
   */
  async update(id: string, updateData: Record<string, any>, tx?: PostgresJsDatabase): Promise<Order> {
    const dbInstance = tx || db;
    
    // Always update the updatedAt timestamp
    const dataToUpdate = {
      ...updateData,
      updatedAt: new Date()
    };
    
    const [updatedOrder] = await dbInstance
      .update(orders)
      .set(dataToUpdate)
      .where(eq(orders.id, id))
      .returning();
      
    return updatedOrder as unknown as Order;
  }
}
