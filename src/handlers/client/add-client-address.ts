/**
 * Add client address handler
 */

import { Request, Response } from 'express';
import { ApiResponse } from '../../models';
import { addClientAddress } from '../../use-cases/client/add-client-address';

/**
 * Add client address handler
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const addClientAddressHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const addressData = req.body;
    const result = await addClientAddress(addressData);
    
    const response: ApiResponse = {
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    };
    
    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: `Error adding client address: ${(error as Error).message}`,
      timestamp: new Date().toISOString()
    };
    res.status(400).json(response);
  }
};
