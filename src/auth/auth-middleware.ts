/**
 * Authentication middleware
 * 
 * Provides middleware functions for route authentication
 */
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to check if user is authenticated
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  res.status(401).json({ 
    success: false, 
    message: 'Authentication required' 
  });
};