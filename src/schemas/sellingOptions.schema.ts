import { pgTable, uuid, integer, text } from 'drizzle-orm/pg-core'
import { items } from './items.schema'
import timestamps from './utils/timestamps'
import { merchants } from './merchants.schema'
import { relations } from 'drizzle-orm'

export const sellingOptions = pgTable('selling_options', {
  id: uuid('id').primaryKey().defaultRandom(),
  environmentId: uuid('environment_id')
    .references(() => merchants.id, { onDelete: 'cascade' })
    .notNull(),
  itemId: uuid('item_id')
    .references(() => items.id, { onDelete: 'cascade' }) // CASCADE DELETE
    .notNull()
    .unique(), // Relação 1-para-1 com items
  minimum: integer('minimum'),
  incremental: integer('incremental'),
  averageUnit: text('average_unit'), // Parece ser sempre nulo no JSON
  availableUnits: text('available_units').array(), // Ex: ["UNIT"]
  ...timestamps,
})

export const sellingOptionsRelations = relations(sellingOptions, ({ one }) => ({
  item: one(items, {
    fields: [sellingOptions.itemId],
    references: [items.id],
  }),
}))

export type SellingOption = typeof sellingOptions.$inferSelect
export type NewSellingOption = typeof sellingOptions.$inferInsert
