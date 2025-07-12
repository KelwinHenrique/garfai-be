/**
 * Google authentication handler
 * 
 * Handles Google authentication initiation
 */

import passport from 'passport';

/**
 * Handle Google authentication initiation
 */
export const handleGoogleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
});
