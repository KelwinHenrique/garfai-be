// db/schemas/orderChoices.ts
import { pgTable, uuid, text, varchar, integer } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { orderItems } from './orderItems.schema'
import { choices } from './choices.schema' // Reference to original catalog choice
import timestamps from './utils/timestamps'
import { environments } from './environments.schema'
import { orderGarnishItems } from './orderGarnishItems.schema'

export const orderChoices = pgTable('order_choices', {
  id: uuid('id').primaryKey().defaultRandom(),

  environmentId: uuid('environment_id').references(() => environments.id, {
    onDelete: 'set null',
  }),
  orderItemId: uuid('order_item_id')
    .references(() => orderItems.id, { onDelete: 'cascade' })
    .notNull(),

  // Snapshot from the menu's 'choices' table
  choiceId: uuid('choice_id') // ID of the original choice in the menu
    .references(() => choices.id, { onDelete: 'set null' }), // Keep if menu choice is deleted

  nameAtPurchase: varchar('name_at_purchase', {
    length: 255,
  }), // e.g., "Escolha o Refrigerante"

  // Min/max options for this choice at the time of purchase (could be useful for validation/display)
  minAtPurchase: integer('min_at_purchase'),
  maxAtPurchase: integer('max_at_purchase'),

  displayOrder: integer('display_order').notNull().default(0), // Order of this choice group for the item

  ...timestamps,
})

export const orderChoicesRelations = relations(
  orderChoices,
  ({ one, many }) => ({
    orderItem: one(orderItems, {
      fields: [orderChoices.orderItemId],
      references: [orderItems.id],
    }),
    menuChoice: one(choices, {
      fields: [orderChoices.choiceId],
      references: [choices.id],
    }),
    orderGarnishItems: many(orderGarnishItems), // Renamed relation
    // environment: one(environments, { fields: [orderChoices.environmentId], references: [environments.id] }),
  }),
)

export type OrderChoice = typeof orderChoices.$inferSelect
export type NewOrderChoice = typeof orderChoices.$inferInsert
