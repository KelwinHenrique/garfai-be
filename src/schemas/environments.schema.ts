import {
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { menus } from './menus.schema'
import { userAccess } from './userAccess.schema'
import { operatingHours } from './operatingHours.schema'
import { withdrawParameters } from './withdrawParameters.schema'
import { EMerchantCategoryCode } from '../types/environments/IEnvironment'
import timestamps from './utils/timestamps'

export const categoryCodeEnumDb = pgEnum(
  'category_code_enum',
  Object.values(EMerchantCategoryCode) as [string, ...string[]],
)

export const environments = pgTable('environments', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  cnpj: varchar('cnpj', { length: 14 }).notNull(),

  ifoodMerchantId: varchar('ifood_merchant_id', { length: 255 }),
  description: text('description'),
  logoUrl: text('logo_url'),
  logoBase64: text('logo_base64'),

  coverUrl: text('cover_url'),
  coverBase64: text('cover_base64'),

  categoryName: varchar('category_name', { length: 100 }),
  categoryCode: categoryCodeEnumDb('category_code'),

  rating: numeric('rating', { precision: 2, scale: 1 }),
  minimumOrderValue: integer('minimum_order_value'),
  reputation: jsonb('reputation'),

  preparationTime: integer('preparation_time'),

  timezone: varchar('timezone', { length: 100 }),

  phone: varchar('phone', { length: 20 }),

  //endereco
  city: varchar('city', { length: 100 }),
  country: varchar('country', { length: 100 }),
  district: varchar('district', { length: 100 }),
  latitude: numeric('latitude', { precision: 9, scale: 6 }),
  longitude: numeric('longitude', { precision: 9, scale: 6 }),
  state: varchar('state', { length: 2 }),

  streetName: varchar('street_name', { length: 150 }),
  streetNumber: varchar('street_number', { length: 20 }),
  zipCode: varchar('zip_code', { length: 20 }),
  withdrawParametersId: uuid('withdraw_parameters_id').references(
    () => withdrawParameters.id,
  ),

  ...timestamps,
})

export const environmentsRelations = relations(environments, ({ many }) => ({
  menus: many(menus),
  userAccess: many(userAccess),
  operatingHours: many(operatingHours),
}))

export type Environment = typeof environments.$inferSelect
export type NewEnvironment = typeof environments.$inferInsert
