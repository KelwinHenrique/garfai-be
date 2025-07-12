/**
 * Get all merchants handler
 */

import { Request, Response } from 'express';
import { ApiResponse } from '../../models';
import { MerchantService } from '../../services/merchant-service';

/**
 * Get all merchants handler
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const getMerchants = async (req: Request, res: Response): Promise<void> => {
  try {
    const active = req.query.active === 'true' ? true : 
                  req.query.active === 'false' ? false : 
                  undefined;
    
    const merchantService = new MerchantService();
    const merchants = await merchantService.getMerchants(active);
    
    const response: ApiResponse = {
      success: true,
      data: merchants,
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: `Error retrieving merchants: ${(error as Error).message}`,
      timestamp: new Date().toISOString()
    };
    res.status(500).json(response);
  }
};
