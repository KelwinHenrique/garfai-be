/**
 * Store routes
 * 
 * Defines all store-related routes
 */
import { Router } from 'express';
import { createStore } from './create-store';
import { getStores } from './get-stores';
import { getStoreById } from './get-store-by-id';
import { getStoreBySlug } from './get-store-by-slug';
import { updateStore } from './update-store';
import { deleteStore } from './delete-store';
import { toggleStoreStatus } from './toggle-store-status';
import { isAuthenticated } from '../../auth/auth-middleware';

/**
 * Initialize store routes
 * 
 * @returns Express router with configured store routes
 */
export const storeRouter = (): Router => {
  const router = Router();
  
  // Store routes
  router.post('/', isAuthenticated, createStore);
  router.get('/', getStores);
  router.get('/:id', getStoreById);
  router.get('/slug/:slug', getStoreBySlug);
  router.put('/:id', isAuthenticated, updateStore);
  router.delete('/:id', isAuthenticated, deleteStore);
  router.patch('/:id/status', isAuthenticated, toggleStoreStatus);
  
  return router;
};
