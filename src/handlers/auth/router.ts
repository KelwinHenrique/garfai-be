/**
 * Auth routes
 * 
 * Defines all authentication-related routes
 */
import { Router } from 'express';
import { handleGoogleAuth } from './google-auth';
import { handleGoogleCallback } from './google-callback';
import { handleLoginSuccess } from './login-success';
import { handleLoginFailed } from './login-failed';
import { handleLogout } from './logout';
import { isAuthenticated, isNotAuthenticated } from '../../auth/auth-middleware';

/**
 * Initialize auth routes
 * 
 * @returns Express router with configured auth routes
 */
export const authRouter = (): Router => {
  const router = Router();
  
  // Authentication routes
  router.get('/google', isNotAuthenticated, handleGoogleAuth);
  router.get('/google/callback', isNotAuthenticated, handleGoogleCallback);
  router.get('/login/success', isAuthenticated, handleLoginSuccess);
  router.get('/login/failed', handleLoginFailed);
  router.get('/logout', isAuthenticated, handleLogout);
  
  return router;
};
