/**
 * Environment routes
 * 
 * Defines all environment-related routes
 */
import { Router } from 'express';
import { createEnvironmentHandler } from './create-environment';
import { getEnvironmentsHandler } from './get-environments';
import { getEnvironmentByIdHandler } from './get-environments-by-id';
import { updateEnvironmentHandler } from './update-environments';
import { isAuthenticated } from '../../auth/auth-middleware';

/**
 * Initialize environment routes
 * 
 * @returns Express router with configured environment routes
 */
export const environmentRouter = (): Router => {
  const router = Router();
  
  // Environment routes
  router.post('/', createEnvironmentHandler);
  router.get('/', getEnvironmentsHandler);
  router.get('/:id', getEnvironmentByIdHandler);
  router.put('/:id', isAuthenticated, updateEnvironmentHandler);
  
  return router;
};
