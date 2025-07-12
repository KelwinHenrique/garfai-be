/**
 * Database schema definitions using Drizzle ORM
 */

import { 
  pgTable, 
  uuid, 
  varchar, 
  text, 
  timestamp, 
  boolean, 
  json, 
  decimal, 
  pgEnum,
} from 'drizzle-orm/pg-core';

/**
 * Price range enum for database
 */
export const priceRangeEnum = pgEnum('price_range', ['LOW', 'MEDIUM', 'HIGH', 'PREMIUM']);

/**
 * Merchants table schema
 */
export const merchants = pgTable('merchants', {
  // Basic fields
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  logo: text('logo'),
  coverImage: text('cover_image'),
  
  // Contact information
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  website: text('website'),
  
  // Location
  address: json('address').notNull(),
  
  // Business information
  businessHours: json('business_hours').notNull(),
  categories: json('categories').notNull(),
  priceRange: priceRangeEnum('price_range').notNull(),
  minDeliveryPrice: decimal('min_delivery_price', { precision: 10, scale: 2 }).notNull(),
  deliveryOptions: json('delivery_options').notNull(),
  paymentMethods: json('payment_methods').notNull(),
  
  // Metadata
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0'),
  reviewCount: decimal('review_count', { precision: 10, scale: 0 }).default('0'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  ownerId: uuid('owner_id')
});

