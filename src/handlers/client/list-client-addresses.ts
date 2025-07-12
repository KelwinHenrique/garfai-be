/**
 * List client addresses handler
 */

import { Request, Response } from 'express';
import { listClientAddresses } from '../../use-cases/client/list-client-addresses';

/**
 * Handler for listing all addresses for a client
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export async function listClientAddressesHandler(req: Request, res: Response): Promise<void> {
  try {
    const { clientId } = req.params;
    
    if (!clientId) {
      res.status(400).json({ error: 'Client ID is required' });
      return;
    }
    
    const addresses = await listClientAddresses(clientId);
    
    res.status(200).json({ addresses });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(404).json({ error: errorMessage });
  }
}
