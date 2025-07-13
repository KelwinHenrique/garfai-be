/**
 * Item repository
 *
 * Handles database operations for item entities
 */

import { eq, and, inArray, sql } from "drizzle-orm";
import { db } from "../config/database";
import { Item, items } from "../schemas/items.schema";
import { choices } from "../schemas/choices.schema";
import { garnishItems } from "../schemas/garnishItems.schema";
import { productInfo } from "../schemas/productInfo.schema";
import { sellingOptions } from "../schemas/sellingOptions.schema";
import { productAisles } from "../schemas/productAisles.schema";
import { asc } from "drizzle-orm";
import { EItemTags } from "../types/IItem";
import { menuCategories } from "../schemas/menuCategories.schema";

/**
 * Item repository class
 */
export class ItemRepository {
  /**
   * Get an item by its ID
   *
   * @param id - Item ID
   * @returns The item if found, null otherwise
   */
  async getById(id: string): Promise<Item | null> {
    const item = await db.select().from(items).where(eq(items.id, id)).limit(1);
    return item.length > 0 ? (item[0] as unknown as Item) : null;
  }

  /**
   * Get a full item by its ID with all related entities
   *
   * @param id - Item ID
   * @returns The complete item with all related entities if found, null otherwise
   */
  async getFullItemById(id: string): Promise<any> {
    // Get the item
    const result = await db
      .select()
      .from(items)
      .where(eq(items.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const item = result[0];

    // Get product info
    const productInfoResult = await db
      .select()
      .from(productInfo)
      .where(eq(productInfo.itemId, id))
      .limit(1);

    // Get selling option
    const sellingOptionResult = await db
      .select()
      .from(sellingOptions)
      .where(eq(sellingOptions.itemId, id))
      .limit(1);

    // Get choices
    const choicesResult = await db
      .select()
      .from(choices)
      .where(eq(choices.itemId, id))
      .orderBy(asc(choices.displayOrder));

    // For each choice, get garnish items
    const choicesWithGarnishItems: any[] = [];
    for (const choice of choicesResult) {
      const garnishItemsResult = await db
        .select()
        .from(garnishItems)
        .where(eq(garnishItems.choiceId, choice.id))
        .orderBy(asc(garnishItems.displayOrder));
      choicesWithGarnishItems.push({
        ...choice,
        garnishItems: garnishItemsResult,
      });
    }

    // Get product aisles
    const productAislesResult = await db
      .select()
      .from(productAisles)
      .where(eq(productAisles.itemId, id));

    // Combine all item data with proper typing
    const fullItem: any = {
      ...item,
      productInfo: productInfoResult.length > 0 ? productInfoResult[0] : null,
      sellingOption:
        sellingOptionResult.length > 0 ? sellingOptionResult[0] : null,
      choices: choicesWithGarnishItems,
      productAisles: productAislesResult,
    };

    return fullItem;
  }

  async findItemsByMenuCategoryIdAndEnvironmentIdRepository(
    environmentId: string,
    menuCategoryId: string,
  ) {
    const result = await db
      .select()
      .from(items)
      .where(and(eq(items.menuCategoryId, menuCategoryId), eq(items.environmentId, environmentId)));
    return result;
  }

  async updateItemTagsRepository(tags: string[], itemId: string) {
    const result = await db
      .update(items)
      .set({ tags })
      .where(eq(items.id, itemId))
      .returning();
    return result;
  }

  /**
   * Find items by tags with pagination
   *
   * @param environmentId - Environment ID
   * @param tags - Array of tags to filter by
   * @param page - Page number (starting from 1)
   * @param limit - Number of items per page
   * @returns Object containing items and total count
   */
  async findItemsByTags(
    environmentId: string,
    tags: EItemTags[],
    page: number = 1,
    limit: number = 20
  ): Promise<{ items: any[], total: number }> {
    // Calculate offset based on page and limit
    const offset = (page - 1) * limit;

    // Query to find items with any of the specified tags
    // Using the PostgreSQL array overlap operator && to check if arrays share any elements
    const itemsResult = await db
      .select()
      .from(items)
      .leftJoin(menuCategories, eq(items.menuCategoryId, menuCategories.id))
      .where(
        and(
          eq(items.environmentId, environmentId),
          eq(items.isActive, true),
          sql`${items.tags} && ${tags}::text[]`
        )
      )
      .limit(limit)
      .offset(offset)
      .orderBy(asc(menuCategories.displayOrder), asc(items.displayOrder));

    // Count total items matching the criteria
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(items)
      .where(
        and(
          eq(items.environmentId, environmentId),
          eq(items.isActive, true),
          sql`${items.tags} && ${tags}::text[]`
        )
      );

    // Process items to include category information
    const processedItems = itemsResult.map(row => ({
      ...row.items,
      category: row.menu_categories
    }));

    return {
      items: processedItems,
      total: countResult[0]?.count || 0
    };
  }
}
