/**
 * Create client handler
 */

import { Request, Response } from 'express';
import { ApiResponse } from '../../models';
import { createClient } from '../../use-cases/client/create-client';

/**
 * Create client handler
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const createClientHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const clientData = req.body;
    const result = await createClient(clientData);
    
    const response: ApiResponse = {
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    };
    
    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: `Error creating client: ${(error as Error).message}`,
      timestamp: new Date().toISOString()
    };
    res.status(400).json(response);
  }
};
