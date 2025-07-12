/**
 * Get environment by ID use case
 * 
 * Implements business logic for retrieving a environment by ID
 */

import { EnvironmentRepository } from '../../repositories/EnvironmentRepository';
import { Environment } from '../../schemas/environments.schema';

/**
 * Get a environment by ID
 * 
 * @param id - Environment ID
 * @returns The environment or null if not found
 */
export async function getEnvironmentById(id: string): Promise<Environment | null> {
  const environmentRepository = new EnvironmentRepository();
  return environmentRepository.findById(id);
}
