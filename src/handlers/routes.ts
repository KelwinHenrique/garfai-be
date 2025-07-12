/**
 * Application routes
 * 
 * Defines all API routes for the application
 */
import { Router } from 'express';
import { authRouter } from './auth';
import { merchantRouter } from './merchant';
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
  
  // Merchant routes
  router.use('/merchants', merchantRouter());

  
  return router;
};
