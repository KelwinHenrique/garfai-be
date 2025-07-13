/**
 * Get my user access use case
 * 
 * Retrieves all access permissions for the current user
 */

import { UserAccessRepository } from '../../repositories/UserAccessRepository';
import { UserAccess } from '../../schemas/userAccess.schema';

/**
 * Get all user access records for a specific user
 * 
 * @param userId - User ID to get access records for
 * @returns Array of user access records
 */
export async function getMyUserAccess(userId: string): Promise<UserAccess[]> {
  const userAccessRepository = new UserAccessRepository();
  
  return await userAccessRepository.findByUserIdPopulateEnvironment(userId);
} 