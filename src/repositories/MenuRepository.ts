/**
 * Menu repository
 * 
 * Handles database operations for menu entities
 */

import { eq, and, asc } from 'drizzle-orm';
import { db } from '../config/database';
import { Menu, menus } from '../schemas/menus.schema';
import { NewMenu } from '../schemas/menus.schema';
import { menuCategories as menuCategoriesTable } from '../schemas/menuCategories.schema';
import { items as itemsTable } from '../schemas/items.schema';
import { choices } from '../schemas/choices.schema';
import { garnishItems as garnishItemsTable } from '../schemas/garnishItems.schema';
import { productInfo } from '../schemas/productInfo.schema';
import { sellingOptions } from '../schemas/sellingOptions.schema';
import { productAisles } from '../schemas/productAisles.schema';
import { sql } from 'drizzle-orm';

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

  /**
   * Get a menu by its ID
   * 
   * @param id - Menu ID
   * @returns The menu if found, null otherwise
   */
  async getById(id: string): Promise<Menu | null> {
    const menu = await db.select().from(menus).where(eq(menus.id, id)).limit(1);
    return menu.length > 0 ? menu[0] as unknown as Menu : null;
  }

  /**
   * Get all non-deleted menus for a specific environment
   * 
   * @param environmentId - Environment ID
   * @returns Array of menus for the environment
   */
  async getMenusByEnvironmentId(environmentId: string): Promise<Menu[]> {
    const result = await db
      .select()
      .from(menus)
      .where(
        and(
          eq(menus.environmentId, environmentId)
        )
      )
      .orderBy(asc(menus.createdAt));

    return result as Menu[];
  }

  /**
   * Count menus for a specific environment
   * 
   * @param environmentId - Environment ID
   * @returns Count of menus for the environment
   */
  async countMenusByEnvironmentId(environmentId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(menus)
      .where(
        and(
          eq(menus.environmentId, environmentId)
        )
      );

    return result[0]?.count || 0;
  }

  /**
   * Get a full menu by its ID with all related entities
   * 
   * @param menuId - Menu ID
   * @param environmentId - Environment ID
   * @returns The complete menu with all related entities if found, null otherwise
   */
  async getFullMenuById(menuId: string): Promise<any> {
    // Get the menu
    const result = await db
      .select()
      .from(menus)
      .where(
        and(
          eq(menus.id, menuId)
        )
      )
      .limit(1);
    
    if (result.length === 0) {
      return null;
    }
    
    // Get menu categories
    const menuCategoriesResult = await db
      .select()
      .from(menuCategoriesTable)
      .where(eq(menuCategoriesTable.menuId, menuId))
      .orderBy(asc(menuCategoriesTable.displayOrder));
    
    // Create the full menu object with proper typing
    const fullMenu: any = { ...result[0], menuCategories: [] };
    
    // For each category, get items
    for (const category of menuCategoriesResult) {
      const itemsResult = await db
        .select()
        .from(itemsTable)
        .where(eq(itemsTable.menuCategoryId, category.id))
        .orderBy(asc(itemsTable.displayOrder));
      
      // Create category with items with proper typing
      const categoryWithItems: any = { ...category, items: [] };
      
      // For each item, get related data
      for (const item of itemsResult) {
        // Remove logoBase64 from item
        const { logoBase64, ...itemWithoutLogo } = item;
        
        // Get product info
        const productInfoResult = await db
          .select()
          .from(productInfo)
          .where(eq(productInfo.itemId, item.id))
          .limit(1);
        
        // Get selling option
        const sellingOptionResult = await db
          .select()
          .from(sellingOptions)
          .where(eq(sellingOptions.itemId, item.id))
          .limit(1);
        
        // Get choices
        const choicesResult = await db
          .select()
          .from(choices)
          .where(eq(choices.itemId, item.id))
          .orderBy(asc(choices.displayOrder));
        
        // For each choice, get garnish items
        const choicesWithGarnishItems: any[] = [];
        for (const choice of choicesResult) {
          const garnishItemsResult = await db
            .select()
            .from(garnishItemsTable)
            .where(eq(garnishItemsTable.choiceId, choice.id))
            .orderBy(asc(garnishItemsTable.displayOrder));
          
          // Remove logoBase64 from garnish items
          const garnishItemsWithoutLogo: any[] = garnishItemsResult.map(({ logoBase64, ...rest }) => rest);
          
          choicesWithGarnishItems.push({
            ...choice,
            garnishItems: garnishItemsWithoutLogo
          });
        }
        
        // Get product aisles
        const productAislesResult = await db
          .select()
          .from(productAisles)
          .where(eq(productAisles.itemId, item.id));
        
        // Combine all item data with proper typing
        const fullItem: any = {
          ...itemWithoutLogo,
          productInfo: productInfoResult.length > 0 ? productInfoResult[0] : null,
          sellingOption: sellingOptionResult.length > 0 ? sellingOptionResult[0] : null,
          choices: choicesWithGarnishItems,
          productAisles: productAislesResult
        };
        
        categoryWithItems.items.push(fullItem);
      }
      
      fullMenu.menuCategories.push(categoryWithItems);
    }
    
    return fullMenu;
  }
}