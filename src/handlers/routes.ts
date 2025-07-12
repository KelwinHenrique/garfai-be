/**
 * Application routes
 * 
 * Defines all API routes for the application
 */
import { Router } from 'express';
import { handleHelloWorld } from './hello-world-handler';
import {
  handleGoogleAuth,
  handleGoogleCallback,
  handleLoginSuccess,
  handleLoginFailed,
  handleLogout
} from './auth-handler';
import { isAuthenticated, isNotAuthenticated } from '../auth/auth-middleware';
import { StoreHandler } from './store-handler';

/**
 * Initialize API routes
 * 
 * @returns Express router with configured routes
 */
export const initRoutes = (): Router => {
  const router = Router();
  
  // Hello world route
  router.get('/', handleHelloWorld);
  
  // Authentication routes
  router.get('/auth/google', isNotAuthenticated, handleGoogleAuth);
  router.get('/auth/google/callback', isNotAuthenticated, handleGoogleCallback);
  router.get('/auth/login/success', isAuthenticated, handleLoginSuccess);
  router.get('/auth/login/failed', handleLoginFailed);
  router.get('/auth/logout', isAuthenticated, handleLogout);
  
  // Protected route example
  router.get('/protected', isAuthenticated, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
  });
  
  // Initialize store handler
  const storeHandler = new StoreHandler();
  
  // Store routes
  router.post('/stores', isAuthenticated, (req, res) => storeHandler.createStore(req, res));
  router.get('/stores', (req, res) => storeHandler.getStores(req, res));
  router.get('/stores/:id', (req, res) => storeHandler.getStoreById(req, res));
  router.get('/stores/slug/:slug', (req, res) => storeHandler.getStoreBySlug(req, res));
  router.put('/stores/:id', isAuthenticated, (req, res) => storeHandler.updateStore(req, res));
  router.delete('/stores/:id', isAuthenticated, (req, res) => storeHandler.deleteStore(req, res));
  router.patch('/stores/:id/status', isAuthenticated, (req, res) => storeHandler.toggleStoreStatus(req, res));
  
  return router;
};
