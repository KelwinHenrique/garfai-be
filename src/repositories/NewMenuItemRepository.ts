// repositories/NewMenuCategoryRepository.ts
import { db } from '../config/database';
import { items, NewItem, Item } from '../schemas/items.schema';

export class NewMenuItemRepository {
  async create(newMenuItem: NewItem): Promise<Item> {
    const [insertedMenuItem] = await db.insert(items).values(newMenuItem).returning();
    return insertedMenuItem as unknown as Item;
  }
}