/**
 * Client ID validation middleware
 * 
 * Validates that the clientId header is present in the request
 */

import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../models';

/**
 * Validates that the clientId header is present in the request
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const validateClientId = (req: Request, res: Response, next: NextFunction): void => {
  const clientId = req.header('clientId');
  
  if (!clientId) {
    const response: ApiResponse = {
      success: false,
      error: 'Missing clientId in request header',
      timestamp: new Date().toISOString()
    };
    res.status(400).json(response);
    return;
  }
  
  next();
};
