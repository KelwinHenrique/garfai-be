/**
 * Update merchant handler
 */

import { Request, Response } from 'express';
import { ApiResponse } from '../../models';
import { MerchantUseCase } from '../../use-cases/merchant-use-case';

/**
 * Update merchant handler
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const updateMerchant = async (req: Request, res: Response): Promise<void> => {
  try {
    const merchantId = req.params.id;
    const merchantData = {
      id: merchantId,
      ...req.body
    };
    
    const merchantUseCase = new MerchantUseCase();
    const result = await merchantUseCase.updateMerchant(merchantData);
    
    const response: ApiResponse = {
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: `Error updating merchant: ${(error as Error).message}`,
      timestamp: new Date().toISOString()
    };
    res.status(500).json(response);
  }
};
