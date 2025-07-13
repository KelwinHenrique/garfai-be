/**
 * Get menu by ID handler
 */

import { Request, Response } from 'express';
import { ApiResponse } from '../../models';
import { getMenuById } from '../../use-cases/menu/get-menu-by-id';
import { TransformedMenuData } from '../../use-cases/menu/transform-menu';

/**
 * Get menu by ID handler
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const getMenuByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const menuId = req.params.id;
    const transformedMenu = await getMenuById(menuId) as TransformedMenuData | null;
    
    if (!transformedMenu) {
      const response: ApiResponse = {
        success: false,
        error: 'Menu not found',
        timestamp: new Date().toISOString()
      };
      res.status(404).json(response);
      return;
    }
    
    const response: ApiResponse = {
      success: true,
      data: transformedMenu,
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: `Error retrieving menu: ${(error as Error).message}`,
      timestamp: new Date().toISOString()
    };
    res.status(500).json(response);
  }
};
