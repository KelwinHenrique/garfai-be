/**
 * Get order by ID handler
 */

import { Request, Response } from 'express';
import { ApiResponse } from '../../models';
import { getOrderById } from '../../use-cases/order/get-order-by-id';

/**
 * Get order by ID handler
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const getOrderByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await getOrderById(id);
    
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
