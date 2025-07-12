/**
 * Generate encrypt key handler
 */

import { Request, Response } from 'express';
import { ApiResponse } from '../../models';
import { generateEncryptKey } from '../../use-cases/flows/generate-encrypt-key';

/**
 * Generate encrypt key handler
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const generateEncryptKeyHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await generateEncryptKey();
    
    const response: ApiResponse = {
      success: true,
      data: {
        privateKey: result.privateKey,
        publicKey: result.publicKey,
      },
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: `Error generating encrypt key: ${(error as Error).message}`,
      timestamp: new Date().toISOString()
    };
    res.status(400).json(response);
  }
}; 