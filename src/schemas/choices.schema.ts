import {
  pgTable,
  uuid,
  text,
  integer,
  varchar,
  boolean,
} from 'drizzle-orm/pg-core'
import { items } from './items.schema'
import timestamps from './utils/timestamps'
import { environments } from './environments.schema'
import { relations } from 'drizzle-orm'
import { garnishItems } from './garnishItems.schema'
export const choices = pgTable('choices', {
  id: uuid('id').primaryKey().defaultRandom(),
  environmentId: uuid('environment_id')
    .references(() => environments.id, { onDelete: 'cascade' })
    .notNull(),
  itemId: uuid('item_id')
    .references(() => items.id, { onDelete: 'cascade' }) 
    .notNull(),
  ifoodChoiceCode: text('ifood_choice_code'),
  name: varchar('name', { length: 255 }).notNull(),
  min: integer('min').notNull(),
  max: integer('max').notNull(),
  displayOrder: integer('display_order').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  ...timestamps,
})

export const choicesRelations = relations(choices, ({ one, many }) => ({
  item: one(items, {
    fields: [choices.itemId],
    references: [items.id],
  }),
  garnishItems: many(garnishItems),
}))

export type Choice = typeof choices.$inferSelect
export type NewChoice = typeof choices.$inferInsert
