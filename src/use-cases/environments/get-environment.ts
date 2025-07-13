/**
 * Get environments use case
 * 
 * Implements business logic for retrieving all environments
 */

import { Environment } from '../../schemas/environments.schema';
import { EnvironmentRepository } from '../../repositories/EnvironmentRepository';

/**
 * Get all environments
 * 
 * @param active - If provided, filters environments by active status
 * @param categoryCode - If provided, filters environments by category code
 * @returns Array of environments
 */
export async function getEnvironments(active?: boolean, categoryCode?: string): Promise<Environment[]> {
  const environmentRepository = new EnvironmentRepository();
  return environmentRepository.findAll(active, categoryCode);
}
