/**
 * Create environment use case
 * 
 * Implements business logic for creating a environment
 */

import { EnvironmentRepository } from '../../repositories/EnvironmentRepository';
import { Environment, NewEnvironment } from '../../schemas/environments.schema';

/**
 * Creates a new environment
 * 
 * @param environmentData - Environment creation data
 * @returns The created environment
 */
export async function createEnvironment(environmentData: NewEnvironment): Promise<Environment> {
  const environmentRepository = new EnvironmentRepository();
  
  // Create environment
  return environmentRepository.create(environmentData);
}
