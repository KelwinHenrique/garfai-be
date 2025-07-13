/**
 * Import environment handler
 */

import { Request, Response } from 'express';
import { ApiResponse } from '../../models';
import { importEnvironment } from '../../use-cases/environments/import-environment';

/**
 * Import environment handler
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const importEnvironmentHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = {
      ...req.body,
      userId: req.body.userId // Get the user ID from the authenticated session
    };
    
    const result = await importEnvironment(payload);
    
    // Handle different response statuses from the use case
    const httpStatus = result.httpStatus || 200;
    
    const response: ApiResponse = {
      success: httpStatus < 400,
      data: result.environment || null,
      error: httpStatus >= 400 ? result.message || null : undefined,
      timestamp: new Date().toISOString()
    };
    
    res.status(httpStatus).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: `Error importing environment: ${(error as Error).message}`,
      timestamp: new Date().toISOString()
    };
    res.status(500).json(response);
  }
};
