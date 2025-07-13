// db/schemas/choices.ts
import { pgTable, uuid, text, integer, pgEnum } from 'drizzle-orm/pg-core'
import {
  dietaryRestrictionEnum,
  dishClassificationEnum,
  items,
  portionSizeEnum,
} from './items.schema'
import timestamps from './utils/timestamps'
import { environments } from './environments.schema'
import { relations } from 'drizzle-orm'
import { EOrderStatus } from '../types/orders/IOrder'
import { orders } from './orders.schema'
import { orderChoices } from './orderChoices.schema'
import { EPortionSize } from '../types/menus/IMenu'

export const orderStatusEnum = pgEnum('status', EOrderStatus)

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  environmentId: uuid('environment_id').references(() => environments.id, {
    onDelete: 'set null',
  }),
  orderId: uuid('order_id')
    .references(() => orders.id, { onDelete: 'cascade' }) // Se o pedido for deletado, os itens do pedido também são
    .notNull(),

  // Referência ao item original no catálogo (para lookup, se necessário)
  itemId: uuid('item_id').references(() => items.id, {
    onDelete: 'set null',
  }), // Se o item do catálogo for deletado, manter o registro no pedido

  // Snapshot dos dados do item no momento da compra
  descriptionAtPurchase: text('description_at_purchase'),
  detailsAtPurchase: text('details_at_purchase'),
  logoUrlAtPurchase: text('logo_url_at_purchase'),
  logoBase64AtPurchase: text('logo_base64_at_purchase'), // Snapshot da imagem
  needChoicesAtPurchase: text('need_choices_at_purchase'), // Snapshot da imagem
  unitPriceAtPurchase: integer('unit_price_at_purchase'), // Preço em centavos no momento da compra
  unitMinPriceAtPurchase: integer('unit_min_price_at_purchase'), // Preço mínimo em centavos no momento da compra
  unitOriginalPriceAtPurchase: integer('unit_original_price_at_purchase'), // Preço original em centavos no momento da compra
  promotionTagsAtPurchase: text('promotion_tags_at_purchase').array(), // Ex: ["GROCERIES_LOWEST_PRICE"]
  portionSizeTagAtPurchase: portionSizeEnum('portion_size_tag_at_purchase')
    .notNull()
    .default(EPortionSize.NOT_APPLICABLE),

  dietaryRestrictionsAtPurchase: dietaryRestrictionEnum(
    'dietary_restrictions_at_purchase',
  )
    .array()
    .default([]),
  dishClassificationAtPurchase: dishClassificationEnum(
    'dish_classification_at_purchase',
  )
    .array()
    .default([]),
  /////

  quantity: integer('quantity').notNull().default(1),

  // Preço total para este item contando os adicionais
  singlePriceForItemLine: integer('single_price_for_item_line')
    .notNull()
    .default(0), // Preço base para este item (sem os adicionais)
  // Preço total para este item (quantidade * (preço_base_item + soma dos preços dos complementos))
  // Este valor será calculado e atualizado pelo backend sempre que o item ou seus complementos mudarem no carrinho.
  totalPriceForItemLine: integer('total_price_for_item_line')
    .notNull()
    .default(0), // Preço total em centavos

  notes: text('notes'), // Observações específicas para este item (ex: "sem picles")
  displayOrder: integer('display_order').notNull().default(0),
  ...timestamps,
})

export const orderItemsRelations = relations(orderItems, ({ one, many }) => ({
  environment: one(environments, {
    fields: [orderItems.environmentId],
    references: [environments.id],
  }),
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  menuItem: one(items, {
    // Relação com o item original do catálogo
    fields: [orderItems.itemId],
    references: [items.id],
  }),
  orderChoices: many(orderChoices),
}))

export type OrderItem = typeof orderItems.$inferSelect
export type NewOrderItem = typeof orderItems.$inferInsert
