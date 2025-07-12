import { GoogleUserProfile } from "../../auth";
import { ELoginStrategy, UserCreateInput } from "../../models";
import { UserRepository } from "../../repositories";
import { NewUser, User } from "../../schemas/users.schema";

export async function findOrCreateUser(profile: GoogleUserProfile): Promise<User> {

  const userRepository = new UserRepository();

  try {
    // Check if user already exists by email
    const existingUser = await userRepository.findByEmail(profile.email);

    if (existingUser) {
      // Update last login for existing user
      const updatedUser = await userRepository.updateLastLogin(existingUser.id);
      return updatedUser || existingUser;
    }

    // Create new user from Google profile
    const userData: NewUser = {
      email: profile.email,
      name: profile.displayName,
      password: null, // No password for OAuth users
      loginStrategy: ELoginStrategy.GOOGLE
    };

    const newUser = await userRepository.create(userData);
    return newUser;
  } catch (error) {
    console.error('Error in findOrCreateFromGoogle:', error);
    throw new Error('Failed to find or create user from Google profile');
  }
}