/**
 * Database schema definitions for client and client addresses using Drizzle ORM
 */

import { 
  pgTable, 
  uuid, 
  varchar, 
  timestamp, 
  boolean,
} from 'drizzle-orm/pg-core';

/**
 * Clients table schema
 */
export const clients = pgTable('clients', {
  // Basic fields
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Required fields
  phone: varchar('phone', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 200 }),
  
  // Metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  isActive: boolean('is_active').default(true).notNull()
});

/**
 * Client addresses table schema
 */
export const clientAddresses = pgTable('client_addresses', {
  // Basic fields
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Foreign key to client
  clientId: uuid('client_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
  
  // Address fields
  label: varchar('label', { length: 50 }).notNull(),
  street: varchar('street', { length: 255 }).notNull(),
  number: varchar('number', { length: 50 }).notNull(),
  complement: varchar('complement', { length: 255 }),
  neighborhood: varchar('neighborhood', { length: 255 }).notNull(),
  city: varchar('city', { length: 255 }).notNull(),
  state: varchar('state', { length: 50 }).notNull(),
  zipCode: varchar('zip_code', { length: 50 }).notNull(),
  
  // Coordinates (optional)
  latitude: varchar('latitude', { length: 20 }),
  longitude: varchar('longitude', { length: 20 }),
  
  // Default address flag
  isDefault: boolean('is_default').default(false).notNull(),
  
  // Metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});
