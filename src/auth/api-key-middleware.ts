/**
 * API Key Authentication Middleware
 * 
 * Provides middleware functions for API key validation on public endpoints
 */
import { Request, Response, NextFunction } from 'express';
import { AUTH_CONFIG } from '../config/app-config';

// Interface for request with API key
export interface ApiKeyRequest extends Request {
  apiKey?: string;
}

/**
 * Middleware to validate API key from request headers
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const validateApiKey = (req: ApiKeyRequest, res: Response, next: NextFunction): void => {
  // Get API key from request headers
  const apiKey = req.headers['x-api-key'] as string;
  
  if (!apiKey) {
    res.status(401).json({
      success: false,
      message: 'API key is required'
    });
    return;
  }
  
  // Validate API key against configured keys
  if (!AUTH_CONFIG.API_KEYS || !AUTH_CONFIG.API_KEYS.includes(apiKey)) {
    res.status(403).json({
      success: false,
      message: 'Invalid API key'
    });
    return;
  }
  
  // Store API key in request for potential later use
  req.apiKey = apiKey;
  
  next();
};

/**
 * Factory function to create a middleware that validates API key
 * only for specific endpoints
 * 
 * @param publicPaths - Array of paths that require API key validation
 * @returns Middleware function
 */
export const validateApiKeyForPublicEndpoints = (publicPaths: string[]) => {
  return (req: ApiKeyRequest, res: Response, next: NextFunction): void => {
    // Check if the current path is in the list of public paths
    const isPublicPath = publicPaths.some(path => req.path.startsWith(path));
    
    if (isPublicPath) {
      // If it's a public path, validate the API key
      return validateApiKey(req, res, next);
    }
    
    // If not a public path, continue without validation
    next();
  };
};
