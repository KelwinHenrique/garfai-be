/**
 * Hello world handler
 * 
 * Handles the hello world route requests
 */
import { Request, Response } from 'express';
import type { ApiResponse } from '../models';
import { getHelloWorldMessage } from '../use-cases';

/**
 * Handle hello world request
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @returns Response with hello world message
 */
export const handleHelloWorld = (req: Request, res: Response): Response => {
  const result = getHelloWorldMessage();
  
  const response: ApiResponse<{ message: string }> = {
    success: true,
    data: result,
    timestamp: new Date().toISOString()
  };
  
  return res.json(response);
};
