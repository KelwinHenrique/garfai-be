/**
 * Add client address use case
 */

import { ClientRepository } from '../../repositories/client.repository';
import { ClientAddressRepository } from '../../repositories/client-address.repository';
import { ClientAddress, ClientAddressCreateInput, clientAddressCreateSchema } from '../../models';

/**
 * Add a new address to a client
 * 
 * @param addressData - Client address creation data
 * @returns The created client address
 */
export async function addClientAddress(addressData: ClientAddressCreateInput): Promise<ClientAddress> {
  // Validate input data
  await clientAddressCreateSchema.validate(addressData);
  
  // Check if client exists
  const clientRepository = new ClientRepository();
  const client = await clientRepository.findById(addressData.clientId);
  if (!client) {
    throw new Error(`Client with ID ${addressData.clientId} not found`);
  }
  
  // Create address in database
  const clientAddressRepository = new ClientAddressRepository();
  return clientAddressRepository.create(addressData);
}
