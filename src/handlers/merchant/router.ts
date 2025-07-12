/**
 * Merchant routes
 * 
 * Defines all merchant-related routes
 */
import { Router } from 'express';
import { createMerchant } from './create-merchant';
import { getMerchants } from './get-merchants';
import { getMerchantById } from './get-merchant-by-id';
import { getMerchantBySlug } from './get-merchant-by-slug';
import { updateMerchant } from './update-merchant';
import { deleteMerchant } from './delete-merchant';
import { toggleMerchantStatus } from './toggle-merchant-status';
import { isAuthenticated } from '../../auth/auth-middleware';

/**
 * Initialize merchant routes
 * 
 * @returns Express router with configured merchant routes
 */
export const merchantRouter = (): Router => {
  const router = Router();
  
  // Merchant routes
  router.post('/', isAuthenticated, createMerchant);
  router.get('/', getMerchants);
  router.get('/:id', getMerchantById);
  router.get('/slug/:slug', getMerchantBySlug);
  router.put('/:id', isAuthenticated, updateMerchant);
  router.delete('/:id', isAuthenticated, deleteMerchant);
  router.patch('/:id/status', isAuthenticated, toggleMerchantStatus);
  
  return router;
};
