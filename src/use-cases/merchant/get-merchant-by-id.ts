/**
 * Get merchant by ID use case
 * 
 * Implements business logic for retrieving a merchant by ID
 */

import { MerchantRepository } from '../../repositories/merchant-repository';
import { Merchant } from '../../models';

/**
 * Get a merchant by ID
 * 
 * @param id - Merchant ID
 * @returns The merchant or null if not found
 */
export async function getMerchantById(id: string): Promise<Merchant | null> {
  const merchantRepository = new MerchantRepository();
  return merchantRepository.findById(id);
}
