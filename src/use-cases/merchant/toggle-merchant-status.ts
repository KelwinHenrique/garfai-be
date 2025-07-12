/**
 * Toggle merchant status use case
 * 
 * Implements business logic for toggling a merchant's active status
 */

import { MerchantRepository } from '../../repositories/merchant-repository';
import { Merchant } from '../../models';

/**
 * Toggle merchant active status
 * 
 * @param id - Merchant ID
 * @param isActive - New active status
 * @returns The updated merchant
 * @throws Error if merchant not found
 */
export async function toggleMerchantStatus(id: string, isActive: boolean): Promise<Merchant> {
  const merchantRepository = new MerchantRepository();
  const updatedMerchant = await merchantRepository.updateActiveStatus(id, isActive);
  
  if (!updatedMerchant) {
    throw new Error(`Merchant with ID ${id} not found`);
  }
  
  return updatedMerchant;
}
