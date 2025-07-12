// db/schemas/access.ts
import {
  pgTable,
  uuid,
  boolean,
  timestamp,
  varchar,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import timestamps from './utils/timestamps'
import { EAccessRole } from '../models/userAccess'
import { merchants } from './merchant.schema'
import { users } from './users.schema'

export const userAccessRoleEnum = pgEnum('user_access_role', EAccessRole)

export const userAccess = pgTable('user_access', {
  id: uuid('id').primaryKey().defaultRandom(),

  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  merchantId: uuid('merchant_id')
    .notNull()
    .references(() => merchants.id, { onDelete: 'cascade' }),

  role: userAccessRoleEnum('role').notNull(),
  isActive: boolean('is_active').notNull().default(true),

  ...timestamps, // createdAt, updatedAt
})

export const userAccessRelations = relations(userAccess, ({ one, many }) => ({
  user: one(users, {
    fields: [userAccess.userId],
    references: [users.id],
  }),
  merchant: one(merchants, {
    fields: [userAccess.merchantId],
    references: [merchants.id],
  }),
}))

export type UserAccess = typeof userAccess.$inferSelect
export type NewUserAccess = typeof userAccess.$inferInsert
