/**
 * Authentication handlers
 * 
 * Handles authentication-related routes
 */
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { GoogleUserProfile } from '../auth/passport-config';

/**
 * Handle Google authentication initiation
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const handleGoogleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

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
