/**
 * Get store by ID handler
 * 
 * Handles HTTP request to retrieve a store by its ID
 */

import { Request, Response } from 'express';
import { StoreUseCase } from '../../use-cases/store-use-case';
import { ApiResponse } from '../../models';

/**
 * Get a store by ID
 * 
 * @param req - Express request
 * @param res - Express response
 */
export const getStoreById = async (req: Request, res: Response): Promise<void> => {
  const storeUseCase = new StoreUseCase();
  
  try {
    const { id } = req.params;
    const store = await storeUseCase.getStoreById(id);
    
    if (!store) {
      const response: ApiResponse = {
        success: false,
        error: `Store with ID ${id} not found`,
        timestamp: new Date().toISOString()
      };
      
      res.status(404).json(response);
      return;
    }
    
    const response: ApiResponse = {
      success: true,
      data: store,
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to retrieve store',
      timestamp: new Date().toISOString()
    };
    
    res.status(500).json(response);
  }
};
