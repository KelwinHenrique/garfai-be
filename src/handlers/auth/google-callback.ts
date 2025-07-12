/**
 * Google authentication callback handler
 * 
 * Handles Google authentication callback
 */

import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { GoogleUserProfile } from '../../auth/passport-config';

/**
 * Handle Google authentication callback
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const handleGoogleCallback = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate('google', (err: Error | null, user: GoogleUserProfile, info: { message: string }) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return res.redirect('/auth/login/failed');
    }
    
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      
      return res.redirect('/auth/login/success');
    });
  })(req, res, next);
};
