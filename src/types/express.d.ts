/**
 * Type declarations for Express
 * 
 * Extends Express types to include user authentication
 */
import { GoogleUserProfile } from '../auth/passport-config';

declare global {
  namespace Express {
    /**
     * Extends Express.User interface to include GoogleUserProfile
     */
    interface User extends GoogleUserProfile {}
  }
}
