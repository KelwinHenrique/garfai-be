/**
 * Get order by flow ID and client ID handler
 */

import { Request, Response } from 'express';
import { ApiResponse } from '../../models';
import { getOrderByFlowAndClient } from '../../use-cases/order/get-order-by-flow-and-client';

/**
 * Get order by flow ID and client ID handler
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const getOrderByFlowAndClientHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { flowId } = req.params;
    const clientId = req.header('clientId') as string;
    
    if (!flowId) {
      const response: ApiResponse = {
        success: false,
        error: 'Flow ID is required',
        timestamp: new Date().toISOString()
      };
      res.status(400).json(response);
      return;
    }
    
    const result = await getOrderByFlowAndClient(flowId, clientId);
    
    if (!result) {
      const response: ApiResponse = {
        success: false,
        error: `Order with flow ID ${flowId} and client ID ${clientId} not found`,
        timestamp: new Date().toISOString()
      };
      res.status(404).json(response);
      return;
    }
    
    const response: ApiResponse = {
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: `Error retrieving order: ${(error as Error).message}`,
      timestamp: new Date().toISOString()
    };
    res.status(400).json(response);
  }
};
