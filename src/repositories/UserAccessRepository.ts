import { db } from "../config/database";
import { userAccess } from "../schemas/userAccess.schema";

export class UserAccessRepository {
  async create(userAccessData: any): Promise<any> {
    const [insertedUserAccess] = await db
      .insert(userAccess)
      .values(userAccessData)
      .returning();
    return insertedUserAccess;
  }
}
