/**
 * List client addresses use case
 */

import { ClientRepository } from '../../repositories/ClientRepository';
import { ClientAddressRepository } from '../../repositories/ClientAddressRepository';
import { ClientAddress } from '../../models';

/**
 * List all addresses for a client
 * 
 * @param clientId - Client ID to list addresses for
 * @returns Array of client addresses
 */
export async function listClientAddresses(clientId: string): Promise<ClientAddress[]> {
  // Check if client exists
  const clientRepository = new ClientRepository();
  const client = await clientRepository.findById(clientId);
  if (!client) {
    throw new Error(`Client with ID ${clientId} not found`);
  }
  
  // Get addresses from database
  const clientAddressRepository = new ClientAddressRepository();
  return clientAddressRepository.findByClientId(clientId);
}
