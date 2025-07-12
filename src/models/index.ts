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

// Re-export merchant models
export {
  Merchant,
  MerchantAddress,
  MerchantCoordinates,
  MerchantCreateInput,
  MerchantUpdateInput,
  merchantCreateSchema,
  merchantUpdateSchema,
  merchantAddressSchema,
  merchantCoordinatesSchema,
  PriceRange as MerchantPriceRange
} from './merchant';

// Re-export common models from merchant (these are shared between merchant and store)
export { BusinessHours, DayHours, businessHoursSchema, dayHoursSchema } from './merchant';

// Re-export store models (deprecated)
export {
  Store,
  StoreAddress,
  StoreCoordinates,
  StoreCreateInput,
  StoreUpdateInput,
  storeCreateSchema,
  storeUpdateSchema,
  storeAddressSchema,
  storeCoordinatesSchema,
  PriceRange
} from './store';
