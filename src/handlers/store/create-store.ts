/**
 * Create store handler
 * 
 * Handles HTTP request to create a new store
 */

import { Request, Response } from 'express';
import { StoreUseCase } from '../../use-cases/store-use-case';
import { ApiResponse, StoreCreateInput } from '../../models';
import { ValidationError } from 'yup';

/**
 * Create a new store
 * 
 * @param req - Express request
 * @param res - Express response
 */
export const createStore = async (req: Request, res: Response): Promise<void> => {
  const storeUseCase = new StoreUseCase();
  
  try {
    const storeData = req.body as StoreCreateInput;
    const store = await storeUseCase.createStore(storeData);
    
    const response: ApiResponse = {
      success: true,
      data: store,
      timestamp: new Date().toISOString()
    };
    
    res.status(201).json(response);
  } catch (error) {
    let errorMessage = 'Failed to create store';
    let statusCode = 500;
    
    if (error instanceof ValidationError) {
      errorMessage = `Validation error: ${error.message}`;
      statusCode = 400;
    }
    
    const response: ApiResponse = {
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    };
    
    res.status(statusCode).json(response);
  }
};
