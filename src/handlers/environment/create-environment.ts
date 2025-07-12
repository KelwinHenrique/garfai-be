/**
 * Create environment handler
 */

import { Request, Response } from 'express';
import { ApiResponse } from '../../models';
import { createEnvironment } from '../../use-cases/environments/create-environment';

/**
 * Create environment handler
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const createEnvironmentHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const environmentData = req.body;
    const result = await createEnvironment(environmentData);
    
    const response: ApiResponse = {
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    };
    
    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: `Error creating environment: ${(error as Error).message}`,
      timestamp: new Date().toISOString()
    };
    res.status(500).json(response);
  }
};
