/**
 * Create order use case
 */

import { OrderRepository } from '../../repositories/OrderRepository';
import { OrderCreateInput, orderCreateSchema } from '../../models/order';
import { ClientRepository } from '../../repositories/ClientRepository';
import { ClientAddressRepository } from '../../repositories/ClientAddressRepository';
import { EnvironmentRepository } from '../../repositories/EnvironmentRepository';
import { db } from '../../config/database';

/**
 * Create a new order
 * 
 * @param orderData - Order creation data
 * @param clientId - Client ID from the request header
 * @returns The created order
 */
export async function createOrder(orderData: OrderCreateInput, clientId: string) {
  // Validate input data
  await orderCreateSchema.validate(orderData);
  
  // Validate that the client exists
  const clientRepository = new ClientRepository();
  const client = await clientRepository.findById(clientId);
  if (!client) {
    throw new Error(`Client with ID ${clientId} not found`);
  }
  
  // Validate that the client address exists and belongs to the client
  const clientAddressRepository = new ClientAddressRepository();
  const clientAddress = await clientAddressRepository.findById(orderData.clientAddressId);
  if (!clientAddress) {
    throw new Error(`Client address with ID ${orderData.clientAddressId} not found`);
  }
  
  if (clientAddress.clientId !== clientId) {
    throw new Error(`Client address with ID ${orderData.clientAddressId} does not belong to client ${clientId}`);
  }
  
  // Validate that the environment exists
  const environmentRepository = new EnvironmentRepository();
  const environment = await environmentRepository.findById(orderData.environmentId);
  if (!environment) {
    throw new Error(`Environment with ID ${orderData.environmentId} not found`);
  }
  
  // Create order in database using a transaction
  const orderRepository = new OrderRepository();
  
  return await db.transaction(async (tx) => {
    return orderRepository.create(orderData, clientId, tx);
  });
}
