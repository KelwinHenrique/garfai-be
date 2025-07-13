/**
 * Get menus by environment use case
 * 
 * Implements business logic for retrieving all menus for a specific environment
 */

import { MenuRepository } from '../../repositories/MenuRepository';
import { Menu } from '../../schemas/menus.schema';

/**
 * Get all menus for a specific environment with count
 * 
 * @param environmentId - Environment ID
 * @returns Object containing menus array and count
 */
export async function getMenusByEnvironment(environmentId: string): Promise<{ menus: Menu[]; count: number }> {
  const menuRepository = new MenuRepository();
  
  // Execute both queries in parallel for better performance
  const [menus, count] = await Promise.all([
    menuRepository.getMenusByEnvironmentId(environmentId),
    menuRepository.countMenusByEnvironmentId(environmentId)
  ]);
  
  return { menus, count };
} 