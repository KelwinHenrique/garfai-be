// db/schemas/product_aisles.ts
import { pgTable, uuid, text } from 'drizzle-orm/pg-core'
import { items } from './items.schema'
import timestamps from './utils/timestamps'
import { merchants } from './merchants.schema'
import { relations } from 'drizzle-orm'

export const productAisles = pgTable('product_aisles', {
  id: uuid('id').primaryKey().defaultRandom(),
  environmentId: uuid('environment_id')
    .references(() => merchants.id, { onDelete: 'cascade' })
    .notNull(),
  itemId: uuid('item_id')
    .references(() => items.id, { onDelete: 'cascade' })
    .notNull(),
  aisleName: text('aisle_name').notNull(),
  ...timestamps,
})

export const productAislesRelations = relations(productAisles, ({ one }) => ({
  item: one(items, {
    fields: [productAisles.itemId],
    references: [items.id],
  }),
}))

export type ProductAisle = typeof productAisles.$inferSelect
export type NewProductAisle = typeof productAisles.$inferInsert
