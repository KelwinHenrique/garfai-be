/**
 * Delete merchant use case
 * 
 * Implements business logic for deleting a merchant
 */

import { MerchantRepository } from '../../repositories/merchant.repository';

/**
 * Delete a merchant
 * 
 * @param id - Merchant ID
 * @returns True if deleted
 * @throws Error if merchant not found
 */
export async function deleteMerchant(id: string): Promise<boolean> {
  const merchantRepository = new MerchantRepository();
  const deleted = await merchantRepository.delete(id);
  
  if (!deleted) {
    throw new Error(`Merchant with ID ${id} not found`);
  }
  
  return true;
}
