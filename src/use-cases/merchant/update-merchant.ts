/**
 * Update merchant use case
 * 
 * Implements business logic for updating a merchant
 */

import { MerchantRepository } from '../../repositories/merchant-repository';
import { Merchant, MerchantUpdateInput, merchantUpdateSchema } from '../../models';

/**
 * Update a merchant
 * 
 * @param merchantData - Merchant update data
 * @returns The updated merchant
 * @throws Error if merchant not found or validation fails
 */
export async function updateMerchant(merchantData: MerchantUpdateInput): Promise<Merchant> {
  const merchantRepository = new MerchantRepository();
  
  // Validate input data
  await merchantUpdateSchema.validate(merchantData, { abortEarly: false });
  
  // Update merchant
  const updatedMerchant = await merchantRepository.update(merchantData.id, merchantData);
  
  if (!updatedMerchant) {
    throw new Error(`Merchant with ID ${merchantData.id} not found`);
  }
  
  return updatedMerchant;
}
