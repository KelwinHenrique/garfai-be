/**
 * Client repository
 * 
 * Handles database operations for client entities
 */

import { eq } from 'drizzle-orm';
import { db } from '../config/database';
import { clients } from '../schemas/clients.schema';
import { Client, ClientCreateInput } from '../models';

/**
 * Client repository class
 */
export class ClientRepository {
  /**
   * Create a new client in the database
   * 
   * @param clientData - Client creation data
   * @returns The created client
   */
  async create(clientData: ClientCreateInput): Promise<Client> {
    const now = new Date();
    
    const clientToInsert = {
      phone: clientData.phone,
      name: clientData.name || null,
      createdAt: now,
      updatedAt: now,
      isActive: true
    };
    
    const [insertedClient] = await db.insert(clients).values(clientToInsert).returning();
    return insertedClient as unknown as Client;
  }
  
  /**
   * Get a client by ID from the database
   * 
   * @param id - Client ID
   * @returns The client or null if not found
   */
  async findById(id: string): Promise<Client | null> {
    const results = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
    return results.length > 0 ? results[0] as unknown as Client : null;
  }
  
  /**
   * Get a client by phone number from the database
   * 
   * @param phone - Client phone number
   * @returns The client or null if not found
   */
  async findByPhone(phone: string): Promise<Client | null> {
    const results = await db.select().from(clients).where(eq(clients.phone, phone)).limit(1);
    return results.length > 0 ? results[0] as unknown as Client : null;
  }
  
  /**
   * Get all clients from the database
   * 
   * @param active - If provided, filters clients by active status
   * @returns Array of clients
   */
  async findAll(active?: boolean): Promise<Client[]> {
    if (active !== undefined) {
      return db.select().from(clients).where(eq(clients.isActive, active)) as unknown as Promise<Client[]>;
    }
    return db.select().from(clients) as unknown as Promise<Client[]>;
  }
}
