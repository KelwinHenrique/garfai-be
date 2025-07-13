/**
 * Get menus handler
 */

import { Request, Response } from 'express';
import { ApiResponse } from '../../models';
import { getMenusByEnvironment } from '../../use-cases/menu/get-menus';

/**
 * Get menus handler
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const getMenuHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get environmentId from headers
    const environmentId = req.headers.environmentid as string;
    
    if (!environmentId) {
      const response: ApiResponse = {
        success: false,
        error: 'Environment ID is required',
        timestamp: new Date().toISOString()
      };
      res.status(400).json(response);
      return;
    }
    
    const { menus, count } = await getMenusByEnvironment(environmentId);
    
    const response: ApiResponse = {
      success: true,
      data: {
        rows: menus,
        count,
      },
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: `Error retrieving menus: ${(error as Error).message}`,
      timestamp: new Date().toISOString()
    };
    res.status(500).json(response);
  }
}; 