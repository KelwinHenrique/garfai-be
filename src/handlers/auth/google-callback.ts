/**
 * Google authentication callback handler
 * 
 * Handles Google authentication callback
 */

import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { User } from '../../schemas/users.schema';

/**
 * Handle Google authentication callback
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const handleGoogleCallback = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate('google', (err: Error | null, user: User, info: { message: string }) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return res.redirect(`${process.env.FE_BASE_URL}/auth/login/failed`);
    }
    
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      
      return res.redirect(`${process.env.FE_BASE_URL}select-access`);
    });
  })(req, res, next);
};
