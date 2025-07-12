/**
 * Get merchant by slug use case
 * 
 * Implements business logic for retrieving a merchant by slug
 */

import { MerchantRepository } from '../../repositories/merchant.repository';
import { Merchant } from '../../models';

/**
 * Get a merchant by slug
 * 
 * @param slug - Merchant slug
 * @returns The merchant or null if not found
 */
export async function getMerchantBySlug(slug: string): Promise<Merchant | null> {
  const merchantRepository = new MerchantRepository();
  return merchantRepository.findBySlug(slug);
}
