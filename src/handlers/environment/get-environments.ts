/**
 * Get environments handler
 */

import { Request, Response } from 'express';
import { ApiResponse } from '../../models';
import { getEnvironments } from '../../use-cases/environments/get-environment';

/**
 * Get environments handler
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const getEnvironmentsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract query parameters
    const categoryCode = req.query.categoryCode as string | undefined;
    
    // Call the use case with the categoryCode filter if provided
    const environments = await getEnvironments(undefined, categoryCode);
    
    const response: ApiResponse = {
      success: true,
      data: environments,
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: `Error retrieving environments: ${(error as Error).message}`,
      timestamp: new Date().toISOString()
    };
    res.status(500).json(response);
  }
};
