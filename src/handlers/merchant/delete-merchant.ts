/**
 * Delete merchant handler
 */

import { Request, Response } from 'express';
import { ApiResponse } from '../../models';
import { MerchantUseCase } from '../../use-cases/merchant/merchant-use-case';

/**
 * Delete merchant handler
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const deleteMerchant = async (req: Request, res: Response): Promise<void> => {
  try {
    const merchantId = req.params.id;
    const merchantUseCase = new MerchantUseCase();
    const deleted = await merchantUseCase.deleteMerchant(merchantId);
    
    if (!deleted) {
      const response: ApiResponse = {
        success: false,
        error: 'Merchant not found',
        timestamp: new Date().toISOString()
      };
      res.status(404).json(response);
      return;
    }
    
    const response: ApiResponse = {
      success: true,
      data: { id: merchantId, deleted: true },
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: `Error deleting merchant: ${(error as Error).message}`,
      timestamp: new Date().toISOString()
    };
    res.status(500).json(response);
  }
};
