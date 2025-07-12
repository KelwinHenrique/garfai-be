/**
 * Create merchant handler
 */

import { Request, Response } from 'express';
import { ApiResponse } from '../../models';
import { MerchantUseCase } from '../../use-cases/merchant-use-case';

/**
 * Create merchant handler
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const createMerchant = async (req: Request, res: Response): Promise<void> => {
  try {
    const merchantData = req.body;
    const merchantUseCase = new MerchantUseCase();
    const result = await merchantUseCase.createMerchant(merchantData);
    
    const response: ApiResponse = {
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    };
    
    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: `Error creating merchant: ${(error as Error).message}`,
      timestamp: new Date().toISOString()
    };
    res.status(500).json(response);
  }
};
