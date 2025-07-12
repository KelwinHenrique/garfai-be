/**
 * Application routes
 * 
 * Defines all API routes for the application
 */
import { Router } from 'express';
import { authRouter } from './auth';
import { storeRouter } from './store';
import { isAuthenticated } from '../auth/auth-middleware';

/**
 * Initialize API routes
 * 
 * @returns Express router with configured routes
 */
export const initRoutes = (): Router => {
  const router = Router();
  
  // Authentication routes
  router.use('/auth', authRouter());
  
  // Store routes
  router.use('/stores', storeRouter());
  
  return router;
};
