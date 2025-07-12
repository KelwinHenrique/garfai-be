/**
 * Update store handler
 * 
 * Handles HTTP request to update a store
 */

import { Request, Response } from 'express';
import { StoreUseCase } from '../../use-cases/store-use-case';
import { ApiResponse, StoreUpdateInput } from '../../models';
import { ValidationError } from 'yup';

/**
 * Update a store
 * 
 * @param req - Express request
 * @param res - Express response
 */
export const updateStore = async (req: Request, res: Response): Promise<void> => {
  const storeUseCase = new StoreUseCase();
  
  try {
    const { id } = req.params;
    const storeData: StoreUpdateInput = {
      ...req.body,
      id
    };
    
    const updatedStore = await storeUseCase.updateStore(storeData);
    
    const response: ApiResponse = {
      success: true,
      data: updatedStore,
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json(response);
  } catch (error) {
    let errorMessage = 'Failed to update store';
    let statusCode = 500;
    
    if (error instanceof ValidationError) {
      errorMessage = `Validation error: ${error.message}`;
      statusCode = 400;
    } else if (error instanceof Error && error.message.includes('not found')) {
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
