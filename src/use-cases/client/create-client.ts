/**
 * Create client use case
 */

import { ClientRepository } from '../../repositories/ClientRepository';
import { Client, ClientCreateInput, clientCreateSchema } from '../../models';

/**
 * Create a new client
 * 
 * @param clientData - Client creation data
 * @returns The created client
 */
export async function createClient(clientData: ClientCreateInput): Promise<Client> {
  // Validate input data
  await clientCreateSchema.validate(clientData);
  
  // Create client in database
  const clientRepository = new ClientRepository();
  
  // Check if client with this phone already exists
  const existingClient = await clientRepository.findByPhone(clientData.phone);
  if (existingClient) {
    return existingClient;
  }
  
  return clientRepository.create(clientData);
}
