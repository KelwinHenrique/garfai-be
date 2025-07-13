/**
 * Application configuration
 * 
 * Central place for all application configuration settings
 */
import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

/**
 * Server configuration settings
 */
export const SERVER_CONFIG = {
  /** Port the server will listen on */
  PORT: process.env.PORT || 4000,
  /** Node environment */
  NODE_ENV: process.env.NODE_ENV || 'development',
};

/**
 * Authentication configuration settings
 * 
 * Includes session, OAuth, and API key configurations
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
    CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4000/auth/google/callback',
  },
  /** API key configuration for public endpoints */
  API_KEYS: process.env.API_KEYS ? process.env.API_KEYS.split(',') : ['default-dev-api-key'],
};

/**
 * AI services configuration settings
 * 
 * Configuration for AI providers and services
 */
export const AI_CONFIG = {
  /** Google AI API configuration */
  GOOGLE: {
    /** Google API key for AI services */
    API_KEY: process.env.GOOGLE_API_KEY || '',
  },
};
