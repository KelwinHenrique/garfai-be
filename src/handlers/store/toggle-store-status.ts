/**
 * Toggle store status handler
 * 
 * Handles HTTP request to toggle a store's active status
 */

import { Request, Response } from 'express';
import { StoreUseCase } from '../../use-cases/store-use-case';
import { ApiResponse } from '../../models';

/**
 * Toggle store active status
 * 
 * @param req - Express request
 * @param res - Express response
 */
export const toggleStoreStatus = async (req: Request, res: Response): Promise<void> => {
  const storeUseCase = new StoreUseCase();
  
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    if (typeof isActive !== 'boolean') {
      const response: ApiResponse = {
        success: false,
        error: 'isActive must be a boolean',
        timestamp: new Date().toISOString()
      };
      
      res.status(400).json(response);
      return;
    }
    
    const updatedStore = await storeUseCase.toggleStoreStatus(id, isActive);
    
    const response: ApiResponse = {
      success: true,
      data: updatedStore,
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json(response);
  } catch (error) {
    let errorMessage = 'Failed to update store status';
    let statusCode = 500;
    
    if (error instanceof Error && error.message.includes('not found')) {
      errorMessage = error.message;
      statusCode = 404;
    }
    
    const response: ApiResponse = {
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    };
    
    res.status(statusCode).json(response);
  }
};
