// repositories/ProductInfoRepository.ts
import { db } from '../config/database';
import { productInfo, ProductInfo, NewProductInfo } from '../schemas/productInfo.schema';

export class ProductInfoRepository {
  async create(newProductInfo: NewProductInfo): Promise<ProductInfo> {
    const [insertedProductInfo] = await db.insert(productInfo).values(newProductInfo).returning();
    return insertedProductInfo as unknown as ProductInfo;
  }
}