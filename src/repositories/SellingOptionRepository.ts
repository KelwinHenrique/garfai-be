import { db } from '../config/database';
import { sellingOptions, SellingOption, NewSellingOption } from '../schemas/sellingOptions.schema';

export class SellingOptionRepository {
    async create(newSellingOption: NewSellingOption): Promise<SellingOption> {
        const [insertedSellingOption] = await db.insert(sellingOptions).values(newSellingOption).returning();
        return insertedSellingOption as unknown as SellingOption;
      }
}
