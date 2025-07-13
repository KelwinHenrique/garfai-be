// db/schemas/choices.ts
import {
  pgTable,
  uuid,
  text,
  integer,
  varchar,
  pgEnum,
  timestamp,
} from 'drizzle-orm/pg-core'
import timestamps from './utils/timestamps'
import { environments } from './environments.schema'
import { relations } from 'drizzle-orm'
import {
  EOrderPaymentMethod,
  EOrderStatus,
} from '../types/orders/IOrder'
import { orderItems } from './orderItems.schema'
import { clients } from './clients.schema'
import { clientAddresses } from './clients.schema'

export const orderStatusEnum = pgEnum('status', EOrderStatus)
export const orderPaymentMethodTypeEnum = pgEnum(
  'payment_method_type',
  EOrderPaymentMethod,
)

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  environmentId: uuid('environment_id').references(() => environments.id, {
    onDelete: 'set null',
  }),
  clientId: uuid('client_id')
    .references(() => clients.id, {
      onDelete: 'restrict',
    })
    .notNull(),

  whatsappFlowsId: uuid('whatsapp_flows_id').notNull(),

  status: orderStatusEnum('status').notNull().default(EOrderStatus.CART),

  // Valores monetários calculados e armazenados pelo backend
  subtotalAmount: integer('subtotal_amount').notNull().default(0), // Valor apenas dos itens

  discountAmount: integer('discount_amount').default(0), // Valor em centavos
  deliveryFeeAmount: integer('delivery_fee_amount').default(0), // Valor em centavos
  totalAmount: integer('total_amount').notNull().default(0), // valor dos items + frete - desconto

  // Informações do cliente
  clientName: varchar('client_name', { length: 255 }),
  clientSender: varchar('client_sender', { length: 20 }),

  clientAddressId: uuid('client_address_id').references(
    () => clientAddresses.id,
    { onDelete: 'set null' },
  ), // If address is deleted, keep order, nullify address_id

  // Endereço de entrega
  deliveryAddressStreet: text('delivery_address_street'),
  deliveryAddressNumber: varchar('delivery_address_number', { length: 20 }),
  deliveryAddressComplement: text('delivery_address_complement'),
  deliveryAddressNeighborhood: varchar('delivery_address_neighborhood', {
    length: 100,
  }),
  deliveryAddressCity: varchar('delivery_address_city', { length: 100 }),
  deliveryAddressState: varchar('delivery_address_state', { length: 2 }),
  deliveryAddressZipcode: varchar('delivery_address_zipcode', { length: 10 }),
  deliveryInstructions: text('delivery_instructions'),

  // Informações de pagamento e pedido
  paymentMethod: orderPaymentMethodTypeEnum('payment_method'),
  notes: text('notes'),

  sentToWaitingMerchantAcceptanceAt: timestamp(
    'sent_to_waiting_merchant_acceptance_at',
    {
      withTimezone: true,
      mode: 'date',
    },
  ),

  sentToPendingPaymentAt: timestamp('sent_to_pending_payment_at', {
    withTimezone: true,
    mode: 'date',
  }),

  sentToInPreparationAt: timestamp('sent_to_in_preparation_at', {
    withTimezone: true,
    mode: 'date',
  }),
  sentToReadyForDeliveryAt: timestamp('sent_to_ready_for_delivery_at', {
    withTimezone: true,
    mode: 'date',
  }),
  sentToInDeliveryAt: timestamp('sent_to_in_delivery_at', {
    withTimezone: true,
    mode: 'date',
  }),
  sentToDriverOnClientAt: timestamp('sent_to_driver_on_client_at', {
    withTimezone: true,
    mode: 'date',
  }),
  sentToCompletedAt: timestamp('sent_to_completed_at', {
    withTimezone: true,
    mode: 'date',
  }),

  sentToCanceledByMerchantAt: timestamp('sent_to_canceled_by_merchant_at', {
    withTimezone: true,
    mode: 'date',
  }),
  clientOrderReviewAt: timestamp('client_order_review_at', {
    withTimezone: true,
    mode: 'date',
  }),
  sentToCanceledByUserAt: timestamp('sent_to_canceled_by_user_at'),
  sentToRejectedByMerchantAt: timestamp('sent_to_rejected_by_merchant_at', {
    withTimezone: true,
    mode: 'date',
  }),
  sentToPaymentFailedAt: timestamp('sent_to_payment_failed_at', {
    withTimezone: true,
    mode: 'date',
  }),
  sentToExpiredAt: timestamp('sent_to_expired_at', {
    withTimezone: true,
    mode: 'date',
  }),

  cancellationReason: text('cancellation_reason'),

  ...timestamps,
})

export const ordersRelations = relations(orders, ({ one, many }) => ({
  environment: one(environments, {
    fields: [orders.environmentId],
    references: [environments.id],
  }),
  client: one(clients, {
    // The client (e.g., WhatsApp user) who placed the order
    fields: [orders.clientId],
    references: [clients.id],
  }),
  clientAddress: one(clientAddresses, {
    fields: [orders.clientAddressId],
    references: [clientAddresses.id],
  }),
  orderItems: many(orderItems),
}))

export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert
