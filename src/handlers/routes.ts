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
  
  return router;
};
