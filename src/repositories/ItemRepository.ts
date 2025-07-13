/**
 * Item repository
 *
 * Handles database operations for item entities
 */

import { eq, and } from "drizzle-orm";
import { db } from "../config/database";
import { Item, items } from "../schemas/items.schema";
import { choices } from "../schemas/choices.schema";
import { garnishItems } from "../schemas/garnishItems.schema";
import { productInfo } from "../schemas/productInfo.schema";
import { sellingOptions } from "../schemas/sellingOptions.schema";
import { productAisles } from "../schemas/productAisles.schema";
import { asc } from "drizzle-orm";

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

      // Remove logoBase64 from garnish items
      const garnishItemsWithoutLogo: any[] = garnishItemsResult.map(
        ({ logoBase64, ...rest }) => rest
      );

      choicesWithGarnishItems.push({
        ...choice,
        garnishItems: garnishItemsWithoutLogo,
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
}
