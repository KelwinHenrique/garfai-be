/**
 * Get item by ID handler
 */

import { Request, Response } from 'express';
import { ApiResponse } from '../../models';
import { getItemById } from '../../use-cases/menu/get-item-by-id';
import { TransformedItem } from '../../use-cases/menu/transform-menu';

/**
 * Get item by ID handler
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const getItemByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const itemId = req.params.id;
    const transformedItem = await getItemById(itemId) as TransformedItem | null;
    
    if (!transformedItem) {
      const response: ApiResponse = {
        success: false,
        error: 'Item not found',
        timestamp: new Date().toISOString()
      };
      res.status(404).json(response);
      return;
    }
    
    const response: ApiResponse = {
      success: true,
      data: transformedItem,
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: `Error retrieving item: ${(error as Error).message}`,
      timestamp: new Date().toISOString()
    };
    res.status(500).json(response);
  }
};
