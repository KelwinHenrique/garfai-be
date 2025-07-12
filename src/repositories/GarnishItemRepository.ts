import { db } from '../config/database';
import { garnishItems, GarnishItem, NewGarnishItem } from '../schemas/garnishItems.schema';

export class GarnishItemRepository {
    async create(newGarnishItem: NewGarnishItem): Promise<GarnishItem> {
        const [insertedGarnishItem] = await db.insert(garnishItems).values(newGarnishItem).returning();
        return insertedGarnishItem as unknown as GarnishItem;
      }
}