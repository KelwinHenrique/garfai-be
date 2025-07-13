import { db } from "../config/database";
import { userAccess, UserAccess } from "../schemas/userAccess.schema";
import { environments, Environment } from "../schemas/environments.schema";
import { eq } from "drizzle-orm";

export class UserAccessRepository {
  /**
   * Create a new user access record
   * 
   * @param userAccessData - User access creation data
   * @returns The created user access record
   */
  async create(userAccessData: any): Promise<any> {
    const [insertedUserAccess] = await db
      .insert(userAccess)
      .values(userAccessData)
      .returning();
    return insertedUserAccess;
  }

  /**
   * Find all user access records by user ID
   * 
   * @param userId - User ID to search for
   * @returns Array of user access records
   */
  async findByUserId(userId: string): Promise<UserAccess[]> {
    return await db
      .select()
      .from(userAccess)
      .where(eq(userAccess.userId, userId));
  }

  /**
   * Find all user access records by user ID with populated environment data
   * 
   * @param userId - User ID to search for
   * @returns Array of user access records with environment data
   */
  async findByUserIdPopulateEnvironment(userId: string): Promise<(UserAccess & { environment: Environment })[]> {
    return await db
      .select({
        id: userAccess.id,
        userId: userAccess.userId,
        environmentId: userAccess.environmentId,
        role: userAccess.role,
        isActive: userAccess.isActive,
        createdAt: userAccess.createdAt,
        updatedAt: userAccess.updatedAt,
        deletedAt: userAccess.deletedAt,
        environment: environments,
      })
      .from(userAccess)
      .innerJoin(environments, eq(userAccess.environmentId, environments.id))
      .where(eq(userAccess.userId, userId));
  }
}
