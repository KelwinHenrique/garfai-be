/**
 * Store service
 * 
 * Handles business logic for store operations
 */

import { v4 as uuidv4 } from 'uuid';
import { Store, StoreCreateInput, StoreUpdateInput } from '../models';
import { slugify } from '../utils';
import { db } from '../config/database';
import { stores } from '../models/schema';
import { eq } from 'drizzle-orm';

/**
 * Store service class
 */
export class StoreService {
  /**
   * Create a new store
   * 
   * @param storeData - Store creation data
   * @returns The created store
   */
  async createStore(storeData: StoreCreateInput): Promise<Store> {
    const now = new Date();
    
    // Convert minDeliveryPrice to string for database compatibility
    const storeToInsert = {
      name: storeData.name,
      slug: slugify(storeData.name),
      description: storeData.description,
      logo: storeData.logo || null,
      coverImage: storeData.coverImage || null,
      email: storeData.email,
      phone: storeData.phone,
      website: storeData.website || null,
      address: storeData.address,
      businessHours: storeData.businessHours,
      categories: storeData.categories,
      priceRange: storeData.priceRange,
      minDeliveryPrice: String(storeData.minDeliveryPrice),
      deliveryOptions: storeData.deliveryOptions,
      paymentMethods: storeData.paymentMethods,
      ownerId: storeData.ownerId || null,
      createdAt: now,
      updatedAt: now,
      isActive: true
    };
    
    const [insertedStore] = await db.insert(stores).values(storeToInsert).returning();
    return insertedStore as unknown as Store;
  }
  
  /**
   * Get all stores
   * 
   * @param active - If provided, filters stores by active status
   * @returns Array of stores
   */
  async getStores(active?: boolean): Promise<Store[]> {
    if (active !== undefined) {
      return db.select().from(stores).where(eq(stores.isActive, active)) as unknown as Promise<Store[]>;
    }
    return db.select().from(stores) as unknown as Promise<Store[]>;
  }
  
  /**
   * Get a store by ID
   * 
   * @param id - Store ID
   * @returns The store or null if not found
   */
  async getStoreById(id: string): Promise<Store | null> {
    const results = await db.select().from(stores).where(eq(stores.id, id)).limit(1);
    return results.length > 0 ? results[0] as unknown as Store : null;
  }
  
  /**
   * Get a store by slug
   * 
   * @param slug - Store slug
   * @returns The store or null if not found
   */
  async getStoreBySlug(slug: string): Promise<Store | null> {
    const results = await db.select().from(stores).where(eq(stores.slug, slug)).limit(1);
    return results.length > 0 ? results[0] as unknown as Store : null;
  }
  
  /**
   * Update a store
   * 
   * @param storeData - Store update data
   * @returns The updated store or null if not found
   */
  async updateStore(storeData: StoreUpdateInput): Promise<Store | null> {
    // Check if store exists
    const existingStore = await this.getStoreById(storeData.id);
    
    if (!existingStore) {
      return null;
    }
    
    // Generate new slug if name is updated
    const slug = storeData.name ? slugify(storeData.name) : existingStore.slug;
    
    const updateValues: any = {
      ...storeData,
      slug,
      updatedAt: new Date()
    };
    
    // Convert minDeliveryPrice to string if it exists
    if (updateValues.minDeliveryPrice !== undefined) {
      updateValues.minDeliveryPrice = String(updateValues.minDeliveryPrice);
    }
    
    // Remove id from update values
    delete updateValues.id;
    
    const [updatedStore] = await db
      .update(stores)
      .set(updateValues)
      .where(eq(stores.id, storeData.id))
      .returning();
    
    return updatedStore as unknown as Store;
  }
  
  /**
   * Delete a store
   * 
   * @param id - Store ID
   * @returns True if deleted, false if not found
   */
  async deleteStore(id: string): Promise<boolean> {
    const result = await db.delete(stores).where(eq(stores.id, id)).returning({ id: stores.id });
    return result.length > 0;
  }
  
  /**
   * Toggle store active status
   * 
   * @param id - Store ID
   * @param isActive - New active status
   * @returns The updated store or null if not found
   */
  async toggleStoreStatus(id: string, isActive: boolean): Promise<Store | null> {
    const [updatedStore] = await db
      .update(stores)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(stores.id, id))
      .returning();
    
    return updatedStore ? (updatedStore as unknown as Store) : null;
  }
}
