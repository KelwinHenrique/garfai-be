/**
 * Environment model definitions
 */

import * as yup from 'yup';

/**
 * Price range enum for environments
 */
export enum PriceRange {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  PREMIUM = 'PREMIUM'
}

/**
 * Environment coordinates type
 */
export interface EnvironmentCoordinates {
  /** Latitude coordinate */
  latitude: number;
  /** Longitude coordinate */
  longitude: number;
}

/**
 * Environment address type
 */
export interface EnvironmentAddress {
  /** Street name */
  street: string;
  /** Building number */
  number: string;
  /** Additional address information (optional) */
  complement?: string;
  /** Neighborhood */
  neighborhood: string;
  /** City name */
  city: string;
  /** State code */
  state: string;
  /** Postal/ZIP code */
  zipCode: string;
  /** Geographic coordinates */
  coordinates?: EnvironmentCoordinates;
}

/**
 * Business hours for a specific day
 */
export interface DayHours {
  /** Opening time in 24h format (HH:MM) */
  open: string;
  /** Closing time in 24h format (HH:MM) */
  close: string;
}

/**
 * Weekly business hours
 */
export interface BusinessHours {
  /** Monday hours */
  monday?: DayHours;
  /** Tuesday hours */
  tuesday?: DayHours;
  /** Wednesday hours */
  wednesday?: DayHours;
  /** Thursday hours */
  thursday?: DayHours;
  /** Friday hours */
  friday?: DayHours;
  /** Saturday hours */
  saturday?: DayHours;
  /** Sunday hours */
  sunday?: DayHours;
}

/**
 * Environment model interface
 */
export interface Environment {
  /** Unique identifier */
  id: string;
  /** Environment name */
  name: string;
  /** URL-friendly version of name */
  slug: string;
  /** Environment description */
  description: string;
  /** Logo image URL */
  logo?: string | null;
  /** Cover/banner image URL */
  coverImage?: string | null;
  /** Contact email */
  email: string;
  /** Contact phone number */
  phone: string;
  /** Website URL (optional) */
  website?: string | null;
  /** Physical address */
  address: EnvironmentAddress | Record<string, unknown>;
  /** Operating hours */
  businessHours: BusinessHours | Record<string, unknown>;
  /** Food categories/cuisines */
  categories: string[] | Record<string, unknown>;
  /** Price range category */
  priceRange: PriceRange;
  /** Minimum price for delivery orders */
  minDeliveryPrice: number | string;
  /** Available delivery options */
  deliveryOptions: string[] | Record<string, unknown>;
  /** Accepted payment methods */
  paymentMethods: string[] | Record<string, unknown>;
  /** Average customer rating */
  rating?: number | string | null;
  /** Number of reviews */
  reviewCount?: number | string | null;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
  /** Whether the environment is currently active */
  isActive: boolean;
  /** ID of environment owner/admin */
  ownerId?: string | null;
}

/**
 * Environment creation input type (omits auto-generated fields)
 */
export type EnvironmentCreateInput = Omit<Environment, 'id' | 'slug' | 'rating' | 'reviewCount' | 'createdAt' | 'updatedAt' | 'isActive'>;

/**
 * Environment update input type (all fields optional except id)
 */
export type EnvironmentUpdateInput = Partial<Omit<Environment, 'id' | 'createdAt'>> & { id: string };

/**
 * Validation schema for environment coordinates
 */
export const environmentCoordinatesSchema = yup.object({
  latitude: yup.number().required('Latitude is required'),
  longitude: yup.number().required('Longitude is required')
});

/**
 * Validation schema for environment address
 */
export const environmentAddressSchema = yup.object({
  street: yup.string().required('Street is required'),
  number: yup.string().required('Number is required'),
  complement: yup.string(),
  neighborhood: yup.string().required('Neighborhood is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string().required('ZIP code is required'),
  coordinates: environmentCoordinatesSchema
});

/**
 * Validation schema for business hours of a day
 */
export const dayHoursSchema = yup.object({
  open: yup.string().matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (use HH:MM)').required('Opening time is required'),
  close: yup.string().matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (use HH:MM)').required('Closing time is required')
});

/**
 * Validation schema for weekly business hours
 */
export const businessHoursSchema = yup.object({
  monday: dayHoursSchema,
  tuesday: dayHoursSchema,
  wednesday: dayHoursSchema,
  thursday: dayHoursSchema,
  friday: dayHoursSchema,
  saturday: dayHoursSchema,
  sunday: dayHoursSchema
});

/**
 * Validation schema for environment creation
 */
export const environmentCreateSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  logo: yup.string().url('Logo must be a valid URL'),
  coverImage: yup.string().url('Cover image must be a valid URL'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  website: yup.string().url('Website must be a valid URL'),
  address: environmentAddressSchema.required('Address is required'),
  businessHours: businessHoursSchema.required('Business hours are required'),
  categories: yup.array().of(yup.string()).min(1, 'At least one category is required').required('Categories are required'),
  priceRange: yup.mixed<PriceRange>().oneOf(Object.values(PriceRange), 'Invalid price range').required('Price range is required'),
  minDeliveryPrice: yup.number().min(0, 'Minimum delivery price cannot be negative').required('Minimum delivery price is required'),
  deliveryOptions: yup.array().of(yup.string()).min(1, 'At least one delivery option is required').required('Delivery options are required'),
  paymentMethods: yup.array().of(yup.string()).min(1, 'At least one payment method is required').required('Payment methods are required'),
  ownerId: yup.string()
});

/**
 * Validation schema for environment updates
 */
export const environmentUpdateSchema = yup.object({
  id: yup.string().required('Environment ID is required'),
  name: yup.string(),
  description: yup.string(),
  logo: yup.string().url('Logo must be a valid URL'),
  coverImage: yup.string().url('Cover image must be a valid URL'),
  email: yup.string().email('Invalid email'),
  phone: yup.string(),
  website: yup.string().url('Website must be a valid URL'),
  address: environmentAddressSchema,
  businessHours: businessHoursSchema,
  categories: yup.array().of(yup.string()).min(1, 'At least one category is required'),
  priceRange: yup.mixed<PriceRange>().oneOf(Object.values(PriceRange), 'Invalid price range'),
  minDeliveryPrice: yup.number().min(0, 'Minimum delivery price cannot be negative'),
  deliveryOptions: yup.array().of(yup.string()).min(1, 'At least one delivery option is required'),
  paymentMethods: yup.array().of(yup.string()).min(1, 'At least one payment method is required'),
  isActive: yup.boolean(),
  ownerId: yup.string()
});
