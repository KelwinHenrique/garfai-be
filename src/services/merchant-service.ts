/**
 * Merchant service
 * 
 * Handles business logic for merchant operations
 */

import { v4 as uuidv4 } from 'uuid';
import { Merchant, MerchantCreateInput, MerchantUpdateInput } from '../models';
import { slugify } from '../utils';
import { db } from '../config/database';
import { merchants } from '../models/schema';
import { eq } from 'drizzle-orm';

/**
 * Merchant service class
 */
export class MerchantService {
  /**
   * Create a new merchant
   * 
   * @param merchantData - Merchant creation data
   * @returns The created merchant
   */
  async createMerchant(merchantData: MerchantCreateInput): Promise<Merchant> {
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
   * Get all merchants
   * 
   * @param active - If provided, filters merchants by active status
   * @returns Array of merchants
   */
  async getMerchants(active?: boolean): Promise<Merchant[]> {
    if (active !== undefined) {
      return db.select().from(merchants).where(eq(merchants.isActive, active)) as unknown as Promise<Merchant[]>;
    }
    return db.select().from(merchants) as unknown as Promise<Merchant[]>;
  }
  
  /**
   * Get a merchant by ID
   * 
   * @param id - Merchant ID
   * @returns The merchant or null if not found
   */
  async getMerchantById(id: string): Promise<Merchant | null> {
    const results = await db.select().from(merchants).where(eq(merchants.id, id)).limit(1);
    return results.length > 0 ? results[0] as unknown as Merchant : null;
  }
  
  /**
   * Get a merchant by slug
   * 
   * @param slug - Merchant slug
   * @returns The merchant or null if not found
   */
  async getMerchantBySlug(slug: string): Promise<Merchant | null> {
    const results = await db.select().from(merchants).where(eq(merchants.slug, slug)).limit(1);
    return results.length > 0 ? results[0] as unknown as Merchant : null;
  }
  
  /**
   * Update a merchant
   * 
   * @param merchantData - Merchant update data
   * @returns The updated merchant or null if not found
   */
  async updateMerchant(merchantData: MerchantUpdateInput): Promise<Merchant | null> {
    // Check if merchant exists
    const existingMerchant = await this.getMerchantById(merchantData.id);
    
    if (!existingMerchant) {
      return null;
    }
    
    // Generate new slug if name is updated
    const slug = merchantData.name ? slugify(merchantData.name) : existingMerchant.slug;
    
    const updateValues: any = {
      ...merchantData,
      slug,
      updatedAt: new Date()
    };
    
    // Convert minDeliveryPrice to string if it exists
    if (updateValues.minDeliveryPrice !== undefined) {
      updateValues.minDeliveryPrice = String(updateValues.minDeliveryPrice);
    }
    
    // Remove id from update values
    delete updateValues.id;
    
    const [updatedMerchant] = await db
      .update(merchants)
      .set(updateValues)
      .where(eq(merchants.id, merchantData.id))
      .returning();
    
    return updatedMerchant as unknown as Merchant;
  }
  
  /**
   * Delete a merchant
   * 
   * @param id - Merchant ID
   * @returns True if deleted, false if not found
   */
  async deleteMerchant(id: string): Promise<boolean> {
    const result = await db.delete(merchants).where(eq(merchants.id, id)).returning({ id: merchants.id });
    return result.length > 0;
  }
  
  /**
   * Toggle merchant active status
   * 
   * @param id - Merchant ID
   * @param isActive - New active status
   * @returns The updated merchant or null if not found
   */
  async toggleMerchantStatus(id: string, isActive: boolean): Promise<Merchant | null> {
    const [updatedMerchant] = await db
      .update(merchants)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(merchants.id, id))
      .returning();
    
    return updatedMerchant ? (updatedMerchant as unknown as Merchant) : null;
  }
}
