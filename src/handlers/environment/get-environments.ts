/**
 * Get environment by ID handler
 */

import { Request, Response } from 'express';
import { ApiResponse } from '../../models';
import { getEnvironments } from '../../use-cases/environments/get-environment';

/**
 * Get environment by ID handler
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const getEnvironmentsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const environment = await getEnvironments();
    
    const response: ApiResponse = {
      success: true,
      data: environment,
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: `Error retrieving environment: ${(error as Error).message}`,
      timestamp: new Date().toISOString()
    };
    res.status(500).json(response);
  }
};
