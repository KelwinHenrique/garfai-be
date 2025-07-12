// db/schemas/operatingHours.ts
import { pgTable, uuid, time, pgEnum, integer } from 'drizzle-orm/pg-core'
import { environments } from './environments.schema'
import { relations } from 'drizzle-orm'
import { EDayOfWeek } from '../types/environments/IEnvironment'

export const dayOfWeekEnum = pgEnum('day_of_week_enum', EDayOfWeek)

export const operatingHours = pgTable('operating_hours', {
  id: uuid('id').primaryKey().defaultRandom(),
  environmentId: uuid('environment_id')
    .notNull()
    .references(() => environments.id, { onDelete: 'cascade' }),

  dayOfWeek: dayOfWeekEnum('day_of_week').notNull(),

  start: time('start').notNull(),
  duration: integer('duration').notNull(),
})

export const operatingHoursRelations = relations(operatingHours, ({ one }) => ({
  environment: one(environments, {
    fields: [operatingHours.environmentId],
    references: [environments.id],
  }),
}))

export type OperatingHour = typeof operatingHours.$inferSelect
export type NewOperatingHour = typeof operatingHours.$inferInsert
