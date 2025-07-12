/**
 * Update environment use case
 * 
 * Implements business logic for updating a environment
 */

import { EnvironmentRepository } from '../../repositories/EnvironmentRepository';
import { Environment, NewEnvironment } from '../../schemas/environments.schema';

/**
 * Update a environment
 * 
 * @param environmentData - Environment update data
 * @returns The updated environment
 * @throws Error if environment not found or validation fails
 */
export async function updateEnvironment(environmentData: NewEnvironment): Promise<Environment> {
  const environmentRepository = new EnvironmentRepository();
  
  // Update environment
  const updatedEnvironment = await environmentRepository.update(environmentData.id!, environmentData);
  
  if (!updatedEnvironment) {
    throw new Error(`Environment with ID ${environmentData.id!} not found`);
  }
  
  return updatedEnvironment;
}
