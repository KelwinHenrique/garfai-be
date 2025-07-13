// db/schemas/choices.ts
import { pgTable, uuid, integer, text } from 'drizzle-orm/pg-core'
import timestamps from './utils/timestamps'
import { environments } from './environments.schema'
import { relations } from 'drizzle-orm'
import { garnishItems } from './garnishItems.schema'
import { orderChoices } from './orderChoices.schema'

export const orderGarnishItems = pgTable('order_garnish_items', {
  id: uuid('id').primaryKey().defaultRandom(),

  environmentId: uuid('environment_id').references(() => environments.id, {
    onDelete: 'set null',
  }),

  // Referência ao item de complemento original no catálogo
  garnishItemId: uuid('garnish_item_id').references(() => garnishItems.id, {
    onDelete: 'set null',
  }),

  orderChoiceId: uuid('order_choice_id')
    .references(() => orderChoices.id, { onDelete: 'cascade' })
    .notNull(),

  // Snapshot dos dados do complemento no momento da compra
  descriptionAtPurchase: text('description_at_purchase'), // Ex: "Coca-Cola"
  detailsAtPurchase: text('details_at_purchase'),
  unitPriceAtPurchase: integer('unit_price_at_purchase'), // Preço do complemento em centavos no momento da compra
  logoUrlAtPurchase: text('logo_url_at_purchase'),
  logoBase64AtPurchase: text('logo_base64_at_purchase'), // ALTERADO de logo_url para armazenar base64

  totalPriceForGarnishItemLine: integer('total_price_for_garnish_item_line')
    .notNull()
    .default(0), // Preço total em centavos
  quantity: integer('quantity').notNull().default(1), // Geralmente 1, mas pode ser mais se a regra permitir
  displayOrder: integer('display_order').notNull().default(0),
  ...timestamps,
})

export const orderGarnishItemsRelations = relations(
  orderGarnishItems,
  ({ one }) => ({
    environment: one(environments, {
      fields: [orderGarnishItems.environmentId],
      references: [environments.id],
    }),
    menuGarnishItem: one(garnishItems, {
      // Relação com o garnish original do catálogo
      fields: [orderGarnishItems.garnishItemId],
      references: [garnishItems.id],
    }),
    orderChoice: one(orderChoices, {
      // This links it back
      fields: [orderGarnishItems.orderChoiceId],
      references: [orderChoices.id],
    }),
  }),
)

export type OrderGarnishItems = typeof orderGarnishItems.$inferSelect
export type NewOrderGarnishItems = typeof orderGarnishItems.$inferInsert
