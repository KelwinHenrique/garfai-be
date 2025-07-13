/**
 * Create order handler
 */

import { Request, Response } from 'express';
import { ApiResponse } from '../../models';
import { createOrder } from '../../use-cases/order/create-order';

/**
 * Create order handler
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const createOrderHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get clientId from header (validation already done by middleware)
    const clientId = req.header('clientId')!;
    const orderData = req.body;
    
    const result = await createOrder(orderData, clientId);
    
    const response: ApiResponse = {
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    };
    
    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: `Error creating order: ${(error as Error).message}`,
      timestamp: new Date().toISOString()
    };
    res.status(400).json(response);
  }
};
