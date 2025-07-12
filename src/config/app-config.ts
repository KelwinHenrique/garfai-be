/**
 * Application configuration
 * 
 * Central place for all application configuration settings
 */

/**
 * Server configuration settings
 */
export const SERVER_CONFIG = {
  /** Port the server will listen on */
  PORT: process.env.PORT || 3000,
  /** Node environment */
  NODE_ENV: process.env.NODE_ENV || 'development',
};
