/**
 * Store use cases
 * 
 * Implements business logic for store operations
 */

import { StoreService } from '../services/store-service';
import { Store, StoreCreateInput, StoreUpdateInput, storeCreateSchema, storeUpdateSchema } from '../models';
import { ValidationError } from 'yup';

/**
 * Store use case class
 */
export class StoreUseCase {
  private storeService: StoreService;
  
  /**
   * Creates a new StoreUseCase instance
   */
  constructor() {
    this.storeService = new StoreService();
  }
  
  /**
   * Create a new store
   * 
   * @param storeData - Store creation data
   * @returns The created store
   * @throws ValidationError if data is invalid
   */
  async createStore(storeData: StoreCreateInput): Promise<Store> {
    // Validate input data
    await storeCreateSchema.validate(storeData, { abortEarly: false });
    
    // Create store
    return this.storeService.createStore(storeData);
  }
  
  /**
   * Get all stores
   * 
   * @param active - If provided, filters stores by active status
   * @returns Array of stores
   */
  async getStores(active?: boolean): Promise<Store[]> {
    return this.storeService.getStores(active);
  }
  
  /**
   * Get a store by ID
   * 
   * @param id - Store ID
   * @returns The store or null if not found
   */
  async getStoreById(id: string): Promise<Store | null> {
    return this.storeService.getStoreById(id);
  }
  
  /**
   * Get a store by slug
   * 
   * @param slug - Store slug
   * @returns The store or null if not found
   */
  async getStoreBySlug(slug: string): Promise<Store | null> {
    return this.storeService.getStoreBySlug(slug);
  }
  
  /**
   * Update a store
   * 
   * @param storeData - Store update data
   * @returns The updated store
   * @throws Error if store not found or validation fails
   */
  async updateStore(storeData: StoreUpdateInput): Promise<Store> {
    // Validate input data
    await storeUpdateSchema.validate(storeData, { abortEarly: false });
    
    // Update store
    const updatedStore = await this.storeService.updateStore(storeData);
    
    if (!updatedStore) {
      throw new Error(`Store with ID ${storeData.id} not found`);
    }
    
    return updatedStore;
  }
  
  /**
   * Delete a store
   * 
   * @param id - Store ID
   * @returns True if deleted
   * @throws Error if store not found
   */
  async deleteStore(id: string): Promise<boolean> {
    const deleted = await this.storeService.deleteStore(id);
    
    if (!deleted) {
      throw new Error(`Store with ID ${id} not found`);
    }
    
    return true;
  }
  
  /**
   * Toggle store active status
   * 
   * @param id - Store ID
   * @param isActive - New active status
   * @returns The updated store
   * @throws Error if store not found
   */
  async toggleStoreStatus(id: string, isActive: boolean): Promise<Store> {
    const updatedStore = await this.storeService.toggleStoreStatus(id, isActive);
    
    if (!updatedStore) {
      throw new Error(`Store with ID ${id} not found`);
    }
    
    return updatedStore;
  }
}
