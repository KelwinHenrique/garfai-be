// db/schemas/garnish_items.ts
import { pgTable, uuid, text, integer, boolean } from 'drizzle-orm/pg-core'
import { choices } from './choices.schema'
import timestamps from './utils/timestamps'
import { environments} from './environments.schema'
import { relations } from 'drizzle-orm'

export const garnishItems = pgTable('garnish_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  environmentId: uuid('environment_id')
    .references(() => environments.id, { onDelete: 'cascade' })
    .notNull(),
  choiceId: uuid('choice_id')
    .references(() => choices.id, { onDelete: 'cascade' }) // CASCADE DELETE
    .notNull(),
  ifoodGarnishItemId: text('ifood_garnish_item_id'), // ID do garnishItem no iFood
  ifoodGarnishItemCode: text('ifood_garnish_item_code'), // Código do garnishItem no iFood
  description: text('description').notNull(),
  details: text('details'),
  logoUrl: text('logo_url'),
  logoBase64: text('logo_base64'), // ALTERADO de logo_url para armazenar base64
  unitPrice: integer('unit_price').notNull(), // Preço em centavos
  displayOrder: integer('display_order').notNull(), // NOVO
  isActive: boolean('is_active').default(true).notNull(),
  ...timestamps,
})

export const garnishItemsRelations = relations(garnishItems, ({ one }) => ({
  choice: one(choices, {
    fields: [garnishItems.choiceId],
    references: [choices.id],
  }),
}))

export type GarnishItem = typeof garnishItems.$inferSelect
export type NewGarnishItem = typeof garnishItems.$inferInsert
