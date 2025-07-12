/**
 * Merchant use case class
 * 
 * Implements business logic for merchant operations
 */

import { MerchantRepository } from '../../repositories/MerchantRepository';
import { Merchant, MerchantCreateInput, MerchantUpdateInput, merchantCreateSchema, merchantUpdateSchema } from '../../models';

/**
 * Merchant use case class
 */
export class MerchantUseCase {
  private merchantRepository: MerchantRepository;
  
  /**
   * Creates a new MerchantUseCase instance
   */
  constructor() {
    this.merchantRepository = new MerchantRepository();
  }
  
  /**
   * Create a new merchant
   * 
   * @param merchantData - Merchant creation data
   * @returns The created merchant
   * @throws ValidationError if data is invalid
   */
  async createMerchant(merchantData: MerchantCreateInput): Promise<Merchant> {
    // Validate input data
    await merchantCreateSchema.validate(merchantData, { abortEarly: false });
    
    // Create merchant
    return this.merchantRepository.create(merchantData);
  }
  
  /**
   * Get all merchants
   * 
   * @param active - If provided, filters merchants by active status
   * @returns Array of merchants
   */
  async getMerchants(active?: boolean): Promise<Merchant[]> {
    return this.merchantRepository.findAll(active);
  }
  
  /**
   * Get a merchant by ID
   * 
   * @param id - Merchant ID
   * @returns The merchant or null if not found
   */
  async getMerchantById(id: string): Promise<Merchant | null> {
    return this.merchantRepository.findById(id);
  }
  
  /**
   * Get a merchant by slug
   * 
   * @param slug - Merchant slug
   * @returns The merchant or null if not found
   */
  async getMerchantBySlug(slug: string): Promise<Merchant | null> {
    return this.merchantRepository.findBySlug(slug);
  }
  
  /**
   * Update a merchant
   * 
   * @param merchantData - Merchant update data
   * @returns The updated merchant
   * @throws Error if merchant not found or validation fails
   */
  async updateMerchant(merchantData: MerchantUpdateInput): Promise<Merchant> {
    // Validate input data
    await merchantUpdateSchema.validate(merchantData, { abortEarly: false });
    
    // Update merchant
    const updatedMerchant = await this.merchantRepository.update(merchantData.id, merchantData);
    
    if (!updatedMerchant) {
      throw new Error(`Merchant with ID ${merchantData.id} not found`);
    }
    
    return updatedMerchant;
  }
  
  /**
   * Delete a merchant
   * 
   * @param id - Merchant ID
   * @returns True if deleted
   * @throws Error if merchant not found
   */
  async deleteMerchant(id: string): Promise<boolean> {
    const deleted = await this.merchantRepository.delete(id);
    
    if (!deleted) {
      throw new Error(`Merchant with ID ${id} not found`);
    }
    
    return true;
  }
  
  /**
   * Toggle merchant active status
   * 
   * @param id - Merchant ID
   * @param isActive - New active status
   * @returns The updated merchant
   * @throws Error if merchant not found
   */
  async toggleMerchantStatus(id: string, isActive: boolean): Promise<Merchant> {
    const updatedMerchant = await this.merchantRepository.updateActiveStatus(id, isActive);
    
    if (!updatedMerchant) {
      throw new Error(`Merchant with ID ${id} not found`);
    }
    
    return updatedMerchant;
  }
}
