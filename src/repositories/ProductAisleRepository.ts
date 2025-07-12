import { db } from '../config/database';
import { productAisles, ProductAisle, NewProductAisle } from '../schemas/productAisles.schema';

export class ProductAisleRepository {
    async create(newProductAisle: NewProductAisle): Promise<ProductAisle> {
        const [insertedProductAisle] = await db.insert(productAisles).values(newProductAisle).returning();
        return insertedProductAisle as unknown as ProductAisle;
      }
}
