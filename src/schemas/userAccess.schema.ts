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
import { environments } from './environments.schema'
import { users } from './users.schema'

export const userAccessRoleEnum = pgEnum('user_access_role', EAccessRole)

export const userAccess = pgTable('user_access', {
  id: uuid('id').primaryKey().defaultRandom(),

  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  environmentId: uuid('environment_id')
    .notNull()
    .references(() => environments.id, { onDelete: 'cascade' }),

  role: userAccessRoleEnum('role').notNull(),
  isActive: boolean('is_active').notNull().default(true),

  ...timestamps, // createdAt, updatedAt
})

export const userAccessRelations = relations(userAccess, ({ one }) => ({
  user: one(users, {
    fields: [userAccess.userId],
    references: [users.id],
  }),
  environment: one(environments, {
    fields: [userAccess.environmentId],
    references: [environments.id],
  }),
}))

export type UserAccess = typeof userAccess.$inferSelect
export type NewUserAccess = typeof userAccess.$inferInsert
