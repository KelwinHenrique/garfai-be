/**
 * Menu repository
 * 
 * Handles database operations for menu entities
 */

import { eq } from 'drizzle-orm';
import { db } from '../config/database';
import { Menu, menus } from '../schemas/menus.schema';
import { NewMenu } from '../schemas/menus.schema';

/**
 * Menu repository class
 */
export class MenuRepository {
  /**
   * Create a new menu in the database
   * 
   * @param menuData - Menu creation data
   * @returns The created menu
   */
  async create(menuData: NewMenu): Promise<Menu> {
    const now = new Date();
    
    const menuToInsert = {
      environmentId: menuData.environmentId,
      name: menuData.name || null,
      createdAt: now,
      updatedAt: now,
      isActive: true
    };
    
    const [insertedMenu] = await db.insert(menus).values(menuToInsert).returning();
    return insertedMenu as unknown as Menu;
  }

  async updateGeneric(id: string, data: Partial<Menu>): Promise<Menu | null> {
    const now = new Date();
    
    const menuToUpdate = {
      ...data,
      updatedAt: now
    };
    
    const [updatedMenu] = await db.update(menus).set(menuToUpdate).where(eq(menus.id, id)).returning();
    return updatedMenu as unknown as Menu;
  }

  async disableAllMenusByEnvironmentId(environmentId: string): Promise<void> {
    await db.update(menus).set({ isActive: false }).where(eq(menus.environmentId, environmentId));
  }
}