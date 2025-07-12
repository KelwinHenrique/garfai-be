/**
 * Merchant repository
 * 
 * Handles database operations for merchant entities
 */

import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';
import { db } from '../config/database';
import { merchants } from '../models/schema';
import { Merchant, MerchantCreateInput, MerchantUpdateInput } from '../models';
import { slugify } from '../utils';

/**
 * Merchant repository class
 */
export class MerchantRepository {
  /**
   * Create a new merchant in the database
   * 
   * @param merchantData - Merchant creation data
   * @returns The created merchant
   */
  async create(merchantData: MerchantCreateInput): Promise<Merchant> {
    const now = new Date();
    
    // Convert minDeliveryPrice to string for database compatibility
    const merchantToInsert = {
      name: merchantData.name,
      slug: slugify(merchantData.name),
      description: merchantData.description,
      logo: merchantData.logo || null,
      coverImage: merchantData.coverImage || null,
      email: merchantData.email,
      phone: merchantData.phone,
      website: merchantData.website || null,
      address: merchantData.address,
      businessHours: merchantData.businessHours,
      categories: merchantData.categories,
      priceRange: merchantData.priceRange,
      minDeliveryPrice: String(merchantData.minDeliveryPrice),
      deliveryOptions: merchantData.deliveryOptions,
      paymentMethods: merchantData.paymentMethods,
      ownerId: merchantData.ownerId || null,
      createdAt: now,
      updatedAt: now,
      isActive: true
    };
    
    const [insertedMerchant] = await db.insert(merchants).values(merchantToInsert).returning();
    return insertedMerchant as unknown as Merchant;
  }
  
  /**
   * Get all merchants from the database
   * 
   * @param active - If provided, filters merchants by active status
   * @returns Array of merchants
   */
  async findAll(active?: boolean): Promise<Merchant[]> {
    if (active !== undefined) {
      return db.select().from(merchants).where(eq(merchants.isActive, active)) as unknown as Promise<Merchant[]>;
    }
    return db.select().from(merchants) as unknown as Promise<Merchant[]>;
  }
  
  /**
   * Get a merchant by ID from the database
   * 
   * @param id - Merchant ID
   * @returns The merchant or null if not found
   */
  async findById(id: string): Promise<Merchant | null> {
    const results = await db.select().from(merchants).where(eq(merchants.id, id)).limit(1);
    return results.length > 0 ? results[0] as unknown as Merchant : null;
  }
  
  /**
   * Get a merchant by slug from the database
   * 
   * @param slug - Merchant slug
   * @returns The merchant or null if not found
   */
  async findBySlug(slug: string): Promise<Merchant | null> {
    const results = await db.select().from(merchants).where(eq(merchants.slug, slug)).limit(1);
    return results.length > 0 ? results[0] as unknown as Merchant : null;
  }
  
  /**
   * Update a merchant in the database
   * 
   * @param id - Merchant ID
   * @param merchantData - Merchant update data
   * @returns The updated merchant or null if not found
   */
  async update(id: string, merchantData: Partial<Omit<Merchant, 'id' | 'createdAt'>>): Promise<Merchant | null> {
    // Generate new slug if name is updated
    const slug = merchantData.name ? slugify(merchantData.name) : undefined;
    
    const updateValues: any = {
      ...merchantData,
      ...(slug && { slug }),
      updatedAt: new Date()
    };
    
    // Convert minDeliveryPrice to string if it exists
    if (updateValues.minDeliveryPrice !== undefined) {
      updateValues.minDeliveryPrice = String(updateValues.minDeliveryPrice);
    }
    
    const [updatedMerchant] = await db
      .update(merchants)
      .set(updateValues)
      .where(eq(merchants.id, id))
      .returning();
    
    return updatedMerchant ? (updatedMerchant as unknown as Merchant) : null;
  }
  
  /**
   * Delete a merchant from the database
   * 
   * @param id - Merchant ID
   * @returns True if deleted, false if not found
   */
  async delete(id: string): Promise<boolean> {
    const result = await db.delete(merchants).where(eq(merchants.id, id)).returning({ id: merchants.id });
    return result.length > 0;
  }
  
  /**
   * Update merchant active status in the database
   * 
   * @param id - Merchant ID
   * @param isActive - New active status
   * @returns The updated merchant or null if not found
   */
  async updateActiveStatus(id: string, isActive: boolean): Promise<Merchant | null> {
    const [updatedMerchant] = await db
      .update(merchants)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(merchants.id, id))
      .returning();
    
    return updatedMerchant ? (updatedMerchant as unknown as Merchant) : null;
  }
}
