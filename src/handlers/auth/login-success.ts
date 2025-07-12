/**
 * Login success handler
 * 
 * Handles successful login response
 */

import { Request, Response } from 'express';

/**
 * Handle successful login
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const handleLoginSuccess = (req: Request, res: Response): void => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      user: req.user,
    });
  }
};
