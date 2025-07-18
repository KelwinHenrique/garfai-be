/**
 * Passport configuration
 * 
 * Configures Passport.js strategies for authentication
 */
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { AUTH_CONFIG } from '../config/app-config';
import { UserService } from '../services/user.service';
import { findOrCreateUser } from '../use-cases/users';
import { User as UserDrizzle } from '../schemas/users.schema';
import { IncomingMessage } from 'http';

// Define the User type that Passport expects
declare global {
  namespace Express {
    interface User extends UserDrizzle {}
  }
}

/**
 * User profile from Google OAuth
 */
export interface GoogleUserProfile {
  /** Google ID of the user */
  id: string;
  /** User's display name */
  displayName: string;
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** User's email address */
  email: string;
  /** URL to user's profile photo */
  photo?: string;
}

/**
 * Configure Passport with Google OAuth strategy
 */
export const configurePassport = (): void => {
  // Serialize user to session
  passport.serializeUser((user: Express.User, done) => {
    // We know user has an id property based on our UserDrizzle type
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await UserService.getUserById(id);
      done(null, user as Express.User);
    } catch (error) {
      done(error, null);
    }
  });

  // Configure Google OAuth strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: AUTH_CONFIG.GOOGLE.CLIENT_ID,
        clientSecret: AUTH_CONFIG.GOOGLE.CLIENT_SECRET,
        callbackURL: AUTH_CONFIG.GOOGLE.CALLBACK_URL,
        scope: ['profile', 'email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Extract relevant user information from Google profile
          const userProfile: GoogleUserProfile = {
            id: profile.id,
            displayName: profile.displayName,
            firstName: profile.name?.givenName || '',
            lastName: profile.name?.familyName || '',
            email: profile.emails?.[0]?.value || '',
            photo: profile.photos?.[0]?.value,
          };

          console.log('userProfile', userProfile);

          // Find or create user in database
          const user = await findOrCreateUser(userProfile);
          return done(null, user as Express.User);
        } catch (error) {
          return done(error as Error, undefined);
        }
      }
    )
  );
};
