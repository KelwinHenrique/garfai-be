/**
 * Application configuration
 * 
 * Central place for all application configuration settings
 */
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Server configuration settings
 */
export const SERVER_CONFIG = {
  /** Port the server will listen on */
  PORT: process.env.PORT || 3000,
  /** Node environment */
  NODE_ENV: process.env.NODE_ENV || 'development',
};

/**
 * Authentication configuration settings
 */
export const AUTH_CONFIG = {
  /** Session secret for encrypting session data */
  SESSION_SECRET: process.env.SESSION_SECRET || 'garfai-session-secret',
  /** Cookie max age in milliseconds (default: 24 hours) */
  COOKIE_MAX_AGE: 24 * 60 * 60 * 1000,
  /** Google OAuth configuration */
  GOOGLE: {
    /** Google OAuth client ID */
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    /** Google OAuth client secret */
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
    /** Google OAuth callback URL */
    CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
  },
};
