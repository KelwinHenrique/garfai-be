/**
 * Get order by ID handler
 */

import { Request, Response } from 'express';
import { ApiResponse } from '../../models';
import { getOrderByIdWithDetails } from '../../use-cases/order/get-order-by-id-with-details';

/**
 * Get order by ID with all details handler
 * 
 * Returns an order with all its related data populated (items, choices, garnish items, client)
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const getOrderByIdMerchantHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await getOrderByIdWithDetails(id);
    
    if (!result) {
      const response: ApiResponse = {
        success: false,
        error: `Order with ID ${id} not found`,
        timestamp: new Date().toISOString()
      };
      res.status(404).json(response);
      return;
    }
    
    const response: ApiResponse = {
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: `Error retrieving order: ${(error as Error).message}`,
      timestamp: new Date().toISOString()
    };
    res.status(400).json(response);
  }
};
