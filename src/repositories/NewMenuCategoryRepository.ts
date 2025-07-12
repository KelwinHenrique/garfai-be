// repositories/NewMenuCategoryRepository.ts
import { db } from '../config/database';
import { menuCategories, MenuCategory, NewMenuCategory } from '../schemas/menuCategories.schema';

export class NewMenuCategoryRepository {
  async create(newMenuCategory: NewMenuCategory): Promise<MenuCategory> {
    const [insertedMenuCategory] = await db.insert(menuCategories).values(newMenuCategory).returning();
    return insertedMenuCategory as unknown as MenuCategory;
  }
}