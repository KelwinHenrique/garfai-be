/**
 * Get menu by ID use case
 * 
 * Implements business logic for retrieving a menu by ID
 */

import { MenuRepository } from '../../repositories/MenuRepository';
import { transformFullMenuToIFoodShape } from './transform-menu';

/**
 * Get a menu by ID
 * 
 * @param id - Menu ID
 * @returns The transformed menu data or null if not found
 */
export async function getMenuById(id: string): Promise<any> {
  // First get the basic menu data
  const menuRepository = new MenuRepository();
  const menu = await menuRepository.getFullMenuById(id);
  
  // Transform the full menu to iFood shape
  const transformedMenu = transformFullMenuToIFoodShape(menu);
  
  return transformedMenu;
}
