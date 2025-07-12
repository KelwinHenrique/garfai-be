/**
 * Database configuration
 * 
 * Sets up connection to Postgres via Supabase
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Connection string for direct Postgres connection
const connectionString = process.env.DATABASE_URL || '';

// Create Postgres client
const client = postgres(connectionString);

// Create Drizzle ORM instance
export const db = drizzle(client);

/**
 * Test database connection
 * 
 * @returns True if connection is successful
 */
export async function testConnection(): Promise<boolean> {
  try {
    // Test Supabase connection
    const { data, error } = await supabase.from('health_check').select('*').limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}
