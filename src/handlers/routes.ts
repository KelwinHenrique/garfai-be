/**
 * Application routes
 * 
 * Defines all API routes for the application
 */
import { Router } from 'express';
import { handleHelloWorld } from './hello-world-handler';

/**
 * Initialize API routes
 * 
 * @returns Express router with configured routes
 */
export const initRoutes = (): Router => {
  const router = Router();
  
  // Hello world route
  router.get('/', handleHelloWorld);
  
  return router;
};
