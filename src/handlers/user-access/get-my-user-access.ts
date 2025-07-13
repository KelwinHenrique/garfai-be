/**
 * Get my user access handler
 * 
 * Handles request to get current user's access permissions
 */

import { Request, Response } from 'express';
import { getMyUserAccess } from '../../use-cases/user-access/get-my-user-access';

/**
 * Handle get my user access request
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const getMyUserAccessHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('getMyUserAccessHandler');
    if (!req.user || !req.user.id) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const userAccessList = await getMyUserAccess(req.user.id);

    res.status(200).json({
      success: true,
      data: userAccessList
    });
  } catch (error) {
    console.error('Error in getMyUserAccessHandler:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}; 