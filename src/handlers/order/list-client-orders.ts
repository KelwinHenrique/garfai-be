/**
 * List client orders handler
 */

import { Request, Response } from 'express';
import { ApiResponse } from '../../models';
import { getOrdersByClient } from '../../use-cases/order/get-orders-by-client';

/**
 * List client orders handler
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const listClientOrdersHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get clientId from header (validation already done by middleware)
    const clientId = req.header('clientId')!;
    
    const result = await getOrdersByClient(clientId);
    
    const response: ApiResponse = {
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: `Error retrieving orders: ${(error as Error).message}`,
      timestamp: new Date().toISOString()
    };
    res.status(400).json(response);
  }
};
