/**
 * Merchant repository
 * 
 * Handles database operations for merchant entities
 */

import { eq } from 'drizzle-orm';
import { db } from '../config/database';
import { environments, NewEnvironment, Environment } from '../schemas/environments.schema';

/**
 * Environment repository class
 */
export class EnvironmentRepository {
  /**
   * Create a new environment in the database
   * 
   * @param environmentData - Environment creation data
   * @returns The created environment
   */
  async create(environmentData: NewEnvironment): Promise<Environment> {
    const now = new Date();
    
    const environmentToInsert = {
      name: environmentData.name,
      description: environmentData.description,
      cnpj: environmentData.cnpj,
      ifoodMerchantId: environmentData.ifoodMerchantId,
      logoUrl: environmentData.logoUrl,
      logoBase64: environmentData.logoBase64,
      coverUrl: environmentData.coverUrl,
      coverBase64: environmentData.coverBase64,
      categoryName: environmentData.categoryName,
      categoryCode: environmentData.categoryCode,
      rating: environmentData.rating,
      minimumOrderValue: environmentData.minimumOrderValue,
      reputation: environmentData.reputation,
      preparationTime: environmentData.preparationTime,
      timezone: environmentData.timezone,
      phone: environmentData.phone,
      city: environmentData.city,
      country: environmentData.country,
      district: environmentData.district,
      latitude: environmentData.latitude,
      longitude: environmentData.longitude,
      state: environmentData.state,
      streetName: environmentData.streetName,
      streetNumber: environmentData.streetNumber,
      zipCode: environmentData.zipCode,
      withdrawParametersId: environmentData.withdrawParametersId,
      createdAt: now,
      updatedAt: now,
      isActive: true
    };
    
    const [insertedEnvironment] = await db.insert(environments).values(environmentToInsert).returning();
    return insertedEnvironment as unknown as Environment;
  }
  
  /**
   * Get all merchants from the database
   * 
   * @param active - If provided, filters merchants by active status
   * @returns Array of merchants
   */
  async findAll(active?: boolean): Promise<Environment[]> {
    if (active !== undefined) {
      return db.select().from(environments) as unknown as Promise<Environment[]>;
    }
    return db.select().from(environments) as unknown as Promise<Environment[]>;
  }
  
  /**
   * Get a merchant by ID from the database
   * 
   * @param id - Merchant ID
   * @returns The merchant or null if not found
   */
  async findById(id: string): Promise<Environment | null> {
    const results = await db.select().from(environments).where(eq(environments.id, id)).limit(1);
    return results.length > 0 ? results[0] as unknown as Environment : null;
  }
  
  /**
   * Update a merchant in the database
   * 
   * @param id - Merchant ID
   * @param merchantData - Merchant update data
   * @returns The updated merchant or null if not found
   */
  async update(id: string, merchantData: Partial<Omit<Environment, 'id' | 'createdAt'>>): Promise<Environment | null> {
    const updateValues: any = {
      ...merchantData,
      updatedAt: new Date()
    };
    
    const [updatedMerchant] = await db
      .update(environments)
      .set(updateValues)
      .where(eq(environments.id, id))
      .returning();
    
    return updatedMerchant ? (updatedMerchant as unknown as Environment) : null;
  }
  
  /**
   * Delete a merchant from the database
   * 
   * @param id - Merchant ID
   * @returns True if deleted, false if not found
   */
  async delete(id: string): Promise<boolean> {
    const result = await db.delete(environments).where(eq(environments.id, id)).returning({ id: environments.id });
    return result.length > 0;
  }
  
  /**
   * Update merchant active status in the database
   * 
   * @param id - Merchant ID
   * @param isActive - New active status
   * @returns The updated merchant or null if not found
   */
  async updateActiveStatus(id: string, isActive: boolean): Promise<Environment | null> {
    const [updatedMerchant] = await db
      .update(environments)
      .set({ updatedAt: new Date() })
      .where(eq(environments.id, id))
      .returning();
    
    return updatedMerchant ? (updatedMerchant as unknown as Environment) : null;
  }
}
