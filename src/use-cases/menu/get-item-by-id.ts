/**
 * Get item by ID use case
 * 
 * Implements business logic for retrieving an item by ID
 */

import { ItemRepository } from '../../repositories/ItemRepository';
import { transformItemToClientShape } from './transform-menu';

/**
 * Get an item by ID
 * 
 * @param id - Item ID
 * @returns The transformed item data or null if not found
 */
export async function getItemById(id: string): Promise<any> {
  // Get the item data with all related entities
  const itemRepository = new ItemRepository();
  const item = await itemRepository.getFullItemById(id);
  
  if (!item) {
    return null;
  }
  
  // Transform the item to client-friendly shape
  const transformedItem = transformItemToClientShape(item);
  
  return transformedItem;
}
