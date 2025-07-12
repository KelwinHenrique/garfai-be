// db/schema/users.ts
import { pgTable, uuid, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { userAccess } from './userAccess.schema'
import timestamps from './utils/timestamps'
import { userSessions } from './userSessions.schema'
import { ELoginStrategy } from '../models/user'

export const loginStrategyEnum = pgEnum('login_strategy', ELoginStrategy)

// Tabela de usuários
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }), // Campo opcional para autenticação local
  lastLogin: timestamp('last_login', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  loginStrategy: loginStrategyEnum('login_strategy').notNull(),
  ...timestamps,
})

export const usersRelations = relations(users, ({ many }) => ({
  userSessions: many(userSessions),
  userAccess: many(userAccess), // Renomeado para evitar conflito com a tabela userAccess
}))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
