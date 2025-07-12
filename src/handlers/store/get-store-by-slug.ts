/**
 * Get store by slug handler
 * 
 * Handles HTTP request to retrieve a store by its slug
 */

import { Request, Response } from 'express';
import { StoreUseCase } from '../../use-cases/store-use-case';
import { ApiResponse } from '../../models';

/**
 * Get a store by slug
 * 
 * @param req - Express request
 * @param res - Express response
 */
export const getStoreBySlug = async (req: Request, res: Response): Promise<void> => {
  const storeUseCase = new StoreUseCase();
  
  try {
    const { slug } = req.params;
    const store = await storeUseCase.getStoreBySlug(slug);
    
    if (!store) {
      const response: ApiResponse = {
        success: false,
        error: `Store with slug ${slug} not found`,
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
