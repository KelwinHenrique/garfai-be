import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  numeric,
  pgEnum,
  timestamp,
} from 'drizzle-orm/pg-core'
import timestamps from './utils/timestamps'

/**
 * Table for storing withdraw parameters (fees and billing interval) for environments.
 */
export const billingIntervalEnum = pgEnum('billing_interval', [
  'weekly',
  'monthly',
])

export const withdrawParameters = pgTable('withdraw_parameters', {
  /**
   * Primary key (UUID)
   */
  id: uuid('id').primaryKey().defaultRandom(),
  /**
   * Title for the withdraw parameters configuration
   */
  title: varchar('title', { length: 255 }).notNull(),
  /**
   * Description of the withdraw parameters
   */
  description: text('description'),
  /**
   * Fixed fee (in cents)
   */
  fixedFee: integer('fixed_fee').notNull(),
  /**
   * Percentage fee (e.g., 2.5 for 2.5%)
   */
  percentageFee: numeric('percentage_fee', {
    precision: 5,
    scale: 2,
  }).notNull(),
  /**
   * Billing interval (weekly or monthly)
   */
  billingInterval: billingIntervalEnum('billing_interval').notNull(),
  ...timestamps,
})

export type WithdrawParameters = typeof withdrawParameters.$inferSelect
export type NewWithdrawParameters = typeof withdrawParameters.$inferInsert
