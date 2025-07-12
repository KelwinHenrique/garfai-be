/**
 * Error handling utilities
 * 
 * Common error handling functions for the application
 */
import { Request, Response, NextFunction } from 'express';
import type { ApiResponse } from '../models';

/**
 * Global error handler middleware
 * 
 * @param err - Error object
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);
  
  const response: ApiResponse = {
    success: false,
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  };
  
  res.status(500).json(response);
};
