/**
 * Get stores handler
 * 
 * Handles HTTP request to retrieve all stores
 */

import { Request, Response } from 'express';
import { StoreUseCase } from '../../use-cases/store-use-case';
import { ApiResponse } from '../../models';

/**
 * Get all stores
 * 
 * @param req - Express request
 * @param res - Express response
 */
export const getStores = async (req: Request, res: Response): Promise<void> => {
  const storeUseCase = new StoreUseCase();
  
  try {
    const active = req.query.active !== undefined 
      ? req.query.active === 'true'
      : undefined;
    
    const stores = await storeUseCase.getStores(active);
    
    const response: ApiResponse = {
      success: true,
      data: stores,
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to retrieve stores',
      timestamp: new Date().toISOString()
    };
    
    res.status(500).json(response);
  }
};
