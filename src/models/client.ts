/**
 * Client model definitions
 */

import * as yup from 'yup';

/**
 * Client model interface
 */
export interface Client {
  /** Unique identifier */
  id: string;
  /** Phone number (required) */
  phone: string;
  /** Client name (optional) */
  name?: string | null;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
  /** Whether the client is currently active */
  isActive: boolean;
}

/**
 * Client creation input type
 */
export interface ClientCreateInput {
  /** Phone number (required) */
  phone: string;
  /** Client name (optional) */
  name?: string;
}

/**
 * Client address model interface
 */
export interface ClientAddress {
  /** Unique identifier */
  id: string;
  /** Client ID this address belongs to */
  clientId: string;
  /** Address label (e.g., "Home", "Work") */
  label: string;
  /** Street name */
  street: string;
  /** Building number */
  number: string;
  /** Additional address information (optional) */
  complement?: string | null;
  /** Neighborhood */
  neighborhood: string;
  /** City name */
  city: string;
  /** State code */
  state: string;
  /** Postal/ZIP code */
  zipCode: string;
  /** Latitude coordinate (optional) */
  latitude?: number | null;
  /** Longitude coordinate (optional) */
  longitude?: number | null;
  /** Is this the default delivery address */
  isDefault: boolean;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Client address creation input type
 */
export interface ClientAddressCreateInput {
  /** Client ID this address belongs to */
  clientId: string;
  /** Address label (e.g., "Home", "Work") */
  label: string;
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
  /** Latitude coordinate (optional) */
  latitude?: number;
  /** Longitude coordinate (optional) */
  longitude?: number;
  /** Is this the default delivery address */
  isDefault?: boolean;
}

/**
 * Validation schema for client creation
 */
export const clientCreateSchema = yup.object({
  // Only phone is required
  phone: yup.string().required('Phone is required'),
  // Name is optional
  name: yup.string()
});

/**
 * Validation schema for client address creation
 */
export const clientAddressCreateSchema = yup.object({
  clientId: yup.string().required('Client ID is required'),
  label: yup.string().required('Address label is required'),
  street: yup.string().required('Street is required'),
  number: yup.string().required('Number is required'),
  complement: yup.string(),
  neighborhood: yup.string().required('Neighborhood is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string().required('ZIP code is required'),
  latitude: yup.number(),
  longitude: yup.number(),
  isDefault: yup.boolean().default(false)
});
