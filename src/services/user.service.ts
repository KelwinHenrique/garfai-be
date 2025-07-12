/**
 * User service
 * 
 * Handles user-related operations
 */
import { GoogleUserProfile } from '../auth/passport-config';
import { UserRepository } from '../repositories/users.repository';
import { User } from '../schemas/users.schema';
import { UserCreateInput, ELoginStrategy } from '../models';

/**
 * Service for handling user operations
 */
export class UserService {
  private static userRepository = new UserRepository();

  /**
   * Find or create a user from Google profile
   * 
   * @param profile - Google user profile
   * @returns User object
   */
  public static async findOrCreateFromGoogle(profile: GoogleUserProfile): Promise<User> {
    try {
      // Check if user already exists by email
      const existingUser = await this.userRepository.findByEmail(profile.email);

      if (existingUser) {
        // Update last login for existing user
        const updatedUser = await this.userRepository.updateLastLogin(existingUser.id);
        return updatedUser || existingUser;
      }

      // Create new user from Google profile
      const userData: UserCreateInput = {
        email: profile.email,
        name: profile.displayName,
        password: null, // No password for OAuth users
        loginStrategy: ELoginStrategy.GOOGLE
      };

      const newUser = await this.userRepository.create(userData);
      return newUser;
    } catch (error) {
      console.error('Error in findOrCreateFromGoogle:', error);
      throw new Error('Failed to find or create user from Google profile');
    }
  }

  /**
   * Get user by ID
   * 
   * @param id - User ID
   * @returns User object or null if not found
   */
  public static async getUserById(id: string): Promise<User | null> {
    try {
      return await this.userRepository.findById(id);
    } catch (error) {
      console.error('Error in getUserById:', error);
      return null;
    }
  }

  /**
   * Get user by email
   * 
   * @param email - User email
   * @returns User object or null if not found
   */
  public static async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findByEmail(email);
    } catch (error) {
      console.error('Error in getUserByEmail:', error);
      return null;
    }
  }

  /**
   * Get all users
   * 
   * @returns Array of all users
   */
  public static async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      return [];
    }
  }

  /**
   * Update user
   * 
   * @param id - User ID
   * @param userData - User update data
   * @returns Updated user or null if not found
   */
  public static async updateUser(id: string, userData: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
    try {
      return await this.userRepository.update(id, userData);
    } catch (error) {
      console.error('Error in updateUser:', error);
      return null;
    }
  }

  /**
   * Delete user
   * 
   * @param id - User ID
   * @returns True if deleted, false if not found
   */
  public static async deleteUser(id: string): Promise<boolean> {
    try {
      return await this.userRepository.delete(id);
    } catch (error) {
      console.error('Error in deleteUser:', error);
      return false;
    }
  }

  /**
   * Create a new user
   * 
   * @param userData - User creation data
   * @returns Created user
   */
  public static async createUser(userData: UserCreateInput): Promise<User> {
    try {
      return await this.userRepository.create(userData);
    } catch (error) {
      console.error('Error in createUser:', error);
      throw new Error('Failed to create user');
    }
  }

  /**
   * Get users by login strategy
   * 
   * @param loginStrategy - Login strategy to filter by
   * @returns Array of users with the specified login strategy
   */
  public static async getUsersByLoginStrategy(loginStrategy: ELoginStrategy): Promise<User[]> {
    try {
      return await this.userRepository.findByLoginStrategy(loginStrategy);
    } catch (error) {
      console.error('Error in getUsersByLoginStrategy:', error);
      return [];
    }
  }
}
