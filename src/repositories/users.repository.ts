/**
 * User repository
 * 
 * Handles database operations for user entities
 */

import { eq } from 'drizzle-orm';
import { db } from '../config/database';
import { users, User, NewUser } from '../schemas/users.schema';
import { ELoginStrategy } from '../models';

/**
 * User repository class
 */
export class UserRepository {
  /**
   * Create a new user in the database
   * 
   * @param userData - User creation data
   * @returns The created user
   */
  async create(userData: NewUser): Promise<User> {
    const now = new Date();
    
    const userToInsert = {
      email: userData.email,
      name: userData.name,
      password: userData.password || null,
      loginStrategy: userData.loginStrategy,
      lastLogin: now,
      createdAt: now,
      updatedAt: now
    };
    
    const [insertedUser] = await db.insert(users).values(userToInsert).returning();
    return insertedUser;
  }
  
  /**
   * Get all users from the database
   * 
   * @returns Array of users
   */
  async findAll(): Promise<User[]> {
    return db.select().from(users);
  }
  
  /**
   * Get a user by ID from the database
   * 
   * @param id - User ID
   * @returns The user or null if not found
   */
  async findById(id: string): Promise<User | null> {
    const results = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return results.length > 0 ? results[0] : null;
  }
  
  /**
   * Get a user by email from the database
   * 
   * @param email - User email
   * @returns The user or null if not found
   */
  async findByEmail(email: string): Promise<User | null> {
    const results = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return results.length > 0 ? results[0] : null;
  }
  
  /**
   * Update a user in the database
   * 
   * @param id - User ID
   * @param userData - User update data
   * @returns The updated user or null if not found
   */
  async update(id: string, userData: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
    const updateValues: any = {
      ...userData,
      updatedAt: new Date()
    };
    
    const [updatedUser] = await db
      .update(users)
      .set(updateValues)
      .where(eq(users.id, id))
      .returning();
    
    return updatedUser || null;
  }
  
  /**
   * Delete a user from the database
   * 
   * @param id - User ID
   * @returns True if deleted, false if not found
   */
  async delete(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id)).returning({ id: users.id });
    return result.length > 0;
  }
  
  /**
   * Update user's last login timestamp
   * 
   * @param id - User ID
   * @returns The updated user or null if not found
   */
  async updateLastLogin(id: string): Promise<User | null> {
    const [updatedUser] = await db
      .update(users)
      .set({ 
        lastLogin: new Date(), 
        updatedAt: new Date() 
      })
      .where(eq(users.id, id))
      .returning();
    
    return updatedUser || null;
  }
  
  /**
   * Find users by login strategy
   * 
   * @param loginStrategy - Login strategy to filter by
   * @returns Array of users with the specified login strategy
   */
  async findByLoginStrategy(loginStrategy: ELoginStrategy): Promise<User[]> {
    return db.select().from(users).where(eq(users.loginStrategy, loginStrategy));
  }
}
