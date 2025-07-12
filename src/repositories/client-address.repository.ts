/**
 * Client address repository
 * 
 * Handles database operations for client address entities
 */

import { eq, and } from 'drizzle-orm';
import { db } from '../config/database';
import { clientAddresses } from '../schemas/clients.schema';
import { ClientAddress, ClientAddressCreateInput } from '../models';

/**
 * Client address repository class
 */
export class ClientAddressRepository {
  /**
   * Create a new client address in the database
   * 
   * @param addressData - Client address creation data
   * @returns The created client address
   */
  async create(addressData: ClientAddressCreateInput): Promise<ClientAddress> {
    const now = new Date();
    
    // If this is set as default address, unset any existing default addresses for this client
    if (addressData.isDefault) {
      await this.unsetDefaultAddresses(addressData.clientId);
    }
    
    const addressToInsert = {
      clientId: addressData.clientId,
      label: addressData.label,
      street: addressData.street,
      number: addressData.number,
      complement: addressData.complement || null,
      neighborhood: addressData.neighborhood,
      city: addressData.city,
      state: addressData.state,
      zipCode: addressData.zipCode,
      latitude: addressData.latitude ? addressData.latitude.toString() : null,
      longitude: addressData.longitude ? addressData.longitude.toString() : null,
      isDefault: addressData.isDefault || false,
      createdAt: now,
      updatedAt: now
    };
    
    const [insertedAddress] = await db.insert(clientAddresses).values(addressToInsert).returning();
    return insertedAddress as unknown as ClientAddress;
  }
  
  /**
   * Get all addresses for a client from the database
   * 
   * @param clientId - Client ID
   * @returns Array of client addresses
   */
  async findByClientId(clientId: string): Promise<ClientAddress[]> {
    return db.select().from(clientAddresses).where(eq(clientAddresses.clientId, clientId)) as unknown as Promise<ClientAddress[]>;
  }
  
  /**
   * Get a client address by ID from the database
   * 
   * @param id - Address ID
   * @returns The client address or null if not found
   */
  async findById(id: string): Promise<ClientAddress | null> {
    const results = await db.select().from(clientAddresses).where(eq(clientAddresses.id, id)).limit(1);
    return results.length > 0 ? results[0] as unknown as ClientAddress : null;
  }
  
  /**
   * Get the default address for a client from the database
   * 
   * @param clientId - Client ID
   * @returns The default client address or null if not found
   */
  async findDefaultAddress(clientId: string): Promise<ClientAddress | null> {
    const results = await db.select().from(clientAddresses)
      .where(
        and(
          eq(clientAddresses.clientId, clientId),
          eq(clientAddresses.isDefault, true)
        )
      )
      .limit(1);
    return results.length > 0 ? results[0] as unknown as ClientAddress : null;
  }
  
  /**
   * Unset all default addresses for a client
   * 
   * @param clientId - Client ID
   */
  private async unsetDefaultAddresses(clientId: string): Promise<void> {
    await db.update(clientAddresses)
      .set({ isDefault: false, updatedAt: new Date() })
      .where(
        and(
          eq(clientAddresses.clientId, clientId),
          eq(clientAddresses.isDefault, true)
        )
      );
  }
  
  /**
   * Set an address as the default for a client
   * 
   * @param id - Address ID
   * @returns The updated client address or null if not found
   */
  async setAsDefault(id: string): Promise<ClientAddress | null> {
    const address = await this.findById(id);
    if (!address) return null;
    
    // Unset any existing default addresses for this client
    await this.unsetDefaultAddresses(address.clientId);
    
    // Set this address as default
    const [updatedAddress] = await db.update(clientAddresses)
      .set({ isDefault: true, updatedAt: new Date() })
      .where(eq(clientAddresses.id, id))
      .returning();
    
    return updatedAddress ? (updatedAddress as unknown as ClientAddress) : null;
  }
}
