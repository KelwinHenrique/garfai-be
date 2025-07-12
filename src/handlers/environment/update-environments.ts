/**
 * Update environment handler
 */

import { Request, Response } from 'express';
import { ApiResponse } from '../../models';
import { updateEnvironment } from '../../use-cases/environments/update-environment';

/**
 * Update environment handler
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const updateEnvironmentHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const environmentId = req.params.id;
    const environmentData = {
      id: environmentId,
      ...req.body
    };
    
    const result = await updateEnvironment(environmentData);
    
    const response: ApiResponse = {
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: `Error updating environment: ${(error as Error).message}`,
      timestamp: new Date().toISOString()
    };
    res.status(500).json(response);
  }
};
