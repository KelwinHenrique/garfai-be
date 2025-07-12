/**
 * Delete store handler
 * 
 * Handles HTTP request to delete a store
 */

import { Request, Response } from 'express';
import { StoreUseCase } from '../../use-cases/store-use-case';
import { ApiResponse } from '../../models';

/**
 * Delete a store
 * 
 * @param req - Express request
 * @param res - Express response
 */
export const deleteStore = async (req: Request, res: Response): Promise<void> => {
  const storeUseCase = new StoreUseCase();
  
  try {
    const { id } = req.params;
    await storeUseCase.deleteStore(id);
    
    const response: ApiResponse = {
      success: true,
      data: { id },
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json(response);
  } catch (error) {
    let errorMessage = 'Failed to delete store';
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
