import { relations } from 'drizzle-orm'
import { pgTable, text, json, timestamp } from 'drizzle-orm/pg-core'

export const userSessions = pgTable('user_sessions', {
  sid: text('sid').primaryKey(),
  sess: json('sess').notNull(),
  expire: timestamp('expire', { withTimezone: true, mode: 'date' }).notNull(),
})

export const userSessionsRelations = relations(userSessions, () => ({}))

// Tipos
export type UserSession = typeof userSessions.$inferSelect
export type NewUserSession = typeof userSessions.$inferInsert
