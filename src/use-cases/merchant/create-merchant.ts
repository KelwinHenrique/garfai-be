/**
 * Create merchant use case
 * 
 * Implements business logic for creating a merchant
 */

import { MerchantRepository } from '../../repositories/merchant-repository';
import { Merchant, MerchantCreateInput, merchantCreateSchema } from '../../models';

/**
 * Creates a new merchant
 * 
 * @param merchantData - Merchant creation data
 * @returns The created merchant
 * @throws ValidationError if data is invalid
 */
export async function createMerchant(merchantData: MerchantCreateInput): Promise<Merchant> {
  const merchantRepository = new MerchantRepository();
  
  // Validate input data
  await merchantCreateSchema.validate(merchantData, { abortEarly: false });
  
  // Create merchant
  return merchantRepository.create(merchantData);
}
