/**
 * Common type definitions for the application
 */

/**
 * Basic response structure for API endpoints
 */
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
