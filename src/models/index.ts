/**
 * Models index file
 * 
 * Re-exports all models for easier imports
 */

// Export types directly
export interface ApiResponse<T = unknown> {
  /** Status of the response */
  success: boolean;
  /** Response data */
  data?: T;
  /** Error message if applicable */
  error?: string;
  /** Timestamp of the response */
  timestamp: string;
}


// Re-export user models
export {
  ELoginStrategy
} from './user';
// Re-export client models
export {
  Client,
  ClientAddress,
  ClientCreateInput,
  ClientAddressCreateInput,
  clientCreateSchema,
  clientAddressCreateSchema
} from './client';
