/**
 * Get environment by ID handler
 */

import { Request, Response } from 'express';
import { ApiResponse } from '../../models';
import { getEnvironmentById } from '../../use-cases/environments/get-environment-by-id';

/**
 * Get environment by ID handler
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const getEnvironmentByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const environmentId = req.params.id;
    const environment = await getEnvironmentById(environmentId);
    
    if (!environment) {
      const response: ApiResponse = {
        success: false,
        error: 'Environment not found',
        timestamp: new Date().toISOString()
      };
      res.status(404).json(response);
      return;
    }
    
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
