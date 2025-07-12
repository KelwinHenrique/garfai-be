// db/schemas/product_info.ts
import { pgTable, uuid, text, integer, varchar } from 'drizzle-orm/pg-core'
import { items } from './items.schema'
import timestamps from './utils/timestamps'
import { environments } from './environments.schema'
import { relations } from 'drizzle-orm'

export const productInfo = pgTable('product_info', {
  id: uuid('id').primaryKey().defaultRandom(),
  environmentId: uuid('environment_id')
    .references(() => environments.id, { onDelete: 'cascade' })
    .notNull(),
  itemId: uuid('item_id')
    .references(() => items.id, { onDelete: 'cascade' })
    .notNull()
    .unique(), // Relação 1-para-1 com items
  ifoodProductInfoId: text('ifood_product_info_id').notNull(), // ID do productInfo no iFood (geralmente igual ao ifood_item_id)
  packaging: text('packaging'),
  sequence: integer('sequence'),
  quantity: integer('quantity').notNull().default(0),
  unit: varchar('unit', { length: 50 }), // "g", "ml", "kg", "l"
  ean: text('ean'),
  ...timestamps,
})

export const productInfoRelations = relations(productInfo, ({ one }) => ({
  item: one(items, {
    fields: [productInfo.itemId],
    references: [items.id],
  }),
}))

export type ProductInfo = typeof productInfo.$inferSelect
export type NewProductInfo = typeof productInfo.$inferInsert
