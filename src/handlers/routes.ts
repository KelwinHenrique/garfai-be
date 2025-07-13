/**
 * Application routes
 * 
 * Defines all API routes for the application
 */
import { Router } from 'express';
import { authRouter } from './auth';
import { environmentRouter } from './environment/router';
import { isAuthenticated } from '../auth/auth-middleware';
import clientRouter from './client/router';
import menuRouter from './menu/router';
import flowsRouter from './flows/router';
import orderRouter from './order/router';

/**
 * Initialize API routes
 * 
 * @returns Express router with configured routes
 */
export const initRoutes = (): Router => {
  const router = Router();
  
  // Authentication routes
  router.use('/auth', authRouter());
  
  // Environment routes
  router.use('/environments', environmentRouter());

  // Client routes
  router.use('/clients', clientRouter);

  // Menu routes
  router.use('/menu', menuRouter);

  // Flows routes
  router.use('/flows', flowsRouter);

  // Order routes
  router.use('/orders', orderRouter);
  
  return router;
};
