/**
 * Get me handler
 * 
 * Handles request to get current user information
 */

import { Request, Response } from 'express';

/**
 * Handle get current user information request
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const handleGetMe = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('handleGetMe');
    
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    // Remove sensitive information before sending response
    const { password, ...userInfo } = req.user;

    res.status(200).json({
      success: true,
      data: userInfo
    });
  } catch (error) {
    console.error('Error in handleGetMe:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}; 