/**
 * Type declarations for Express
 * 
 * Extends Express types to include user authentication
 */
import { GoogleUserProfile } from '../auth/passport-config';
import { User as UserDrizzle } from '../schemas/users.schema';

declare global {
  namespace Express {
    /**
     * Extends Express.User interface to include GoogleUserProfile
     */
    interface User extends UserDrizzle { }
  }
}
