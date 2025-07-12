/**
 * Logout handler
 * 
 * Handles user logout
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Handle logout
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const handleLogout = (req: Request, res: Response, next: NextFunction): void => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    
    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  });
};
