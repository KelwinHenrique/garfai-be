/**
 * Order handler
 */

import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../models';
import { callOrderAction } from '../../use-cases/flows/order';

/**
 * Order handler
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const orderHandler = async (req: Request, res: Response,  next: NextFunction): Promise<void> => {
  try {
    const actionResponse = await callOrderAction(req.body.decryptedPayload);

    req.body.encryptedResponse = actionResponse
    next()
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: `Error creating order: ${(error as Error).message}`,
      timestamp: new Date().toISOString()
    };
    res.status(400).json(response);
  }
}; 