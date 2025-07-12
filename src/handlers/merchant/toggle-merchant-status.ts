/**
 * Toggle merchant active status handler
 */

import { Request, Response } from 'express';
import { ApiResponse } from '../../models';
import { MerchantService } from '../../services/merchant-service';

/**
 * Toggle merchant active status handler
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const toggleMerchantStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const merchantId = req.params.id;
    const { isActive } = req.body;
    
    // Validate isActive is a boolean
    if (typeof isActive !== 'boolean') {
      const response: ApiResponse = {
        success: false,
        error: 'isActive must be a boolean value',
        timestamp: new Date().toISOString()
      };
      res.status(400).json(response);
      return;
    }
    
    const merchantService = new MerchantService();
    const updatedMerchant = await merchantService.toggleMerchantStatus(merchantId, isActive);
    
    if (!updatedMerchant) {
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
      data: updatedMerchant,
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: `Error updating merchant status: ${(error as Error).message}`,
      timestamp: new Date().toISOString()
    };
    res.status(500).json(response);
  }
};
