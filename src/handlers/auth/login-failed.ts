/**
 * Login failed handler
 * 
 * Handles failed login response
 */

import { Request, Response } from 'express';

/**
 * Handle failed login
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const handleLoginFailed = (req: Request, res: Response): void => {
  res.status(401).json({
    success: false,
    message: 'Authentication failed',
  });
};
