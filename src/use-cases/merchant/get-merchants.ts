/**
 * Get merchants use case
 * 
 * Implements business logic for retrieving all merchants
 */

import { MerchantRepository } from '../../repositories/merchant.repository';
import { Merchant } from '../../models';

/**
 * Get all merchants
 * 
 * @param active - If provided, filters merchants by active status
 * @returns Array of merchants
 */
export async function getMerchants(active?: boolean): Promise<Merchant[]> {
  const merchantRepository = new MerchantRepository();
  return merchantRepository.findAll(active);
}
