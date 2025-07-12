/**
 * Get merchant by slug handler
 */

import { Request, Response } from 'express';
import { ApiResponse } from '../../models';
import { MerchantService } from '../../services/merchant-service';

/**
 * Get merchant by slug handler
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const getMerchantBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug;
    const merchantService = new MerchantService();
    const merchant = await merchantService.getMerchantBySlug(slug);
    
    if (!merchant) {
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
      data: merchant,
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: `Error retrieving merchant: ${(error as Error).message}`,
      timestamp: new Date().toISOString()
    };
    res.status(500).json(response);
  }
};
