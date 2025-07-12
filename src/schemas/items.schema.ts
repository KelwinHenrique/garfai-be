// db/schemas/items.ts
import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { menuCategories } from './menuCategories.schema'
import timestamps from './utils/timestamps'
import { merchants } from './merchants.schema'
import { relations } from 'drizzle-orm'
import { productInfo } from './productInfo.schema'
import { choices } from './choices.schema'
import { sellingOptions } from './sellingOptions.schema'
import { productAisles } from './productAisles.schema'
import {
  EDietaryRestriction,
  EDishClassification,
  EPortionSize,
} from '../types/menus/IMenu'

export const portionSizeEnum = pgEnum('portionSize', EPortionSize)

export const dietaryRestrictionEnum = pgEnum(
  'dietary_restrictions',
  EDietaryRestriction,
)

export const dishClassificationEnum = pgEnum(
  'dish_classifications',
  EDishClassification,
)

export const items = pgTable('items', {
  id: uuid('id').primaryKey().defaultRandom(),
  environmentId: uuid('environment_id')
    .references(() => merchants.id, { onDelete: 'cascade' })
    .notNull(),
  menuCategoryId: uuid('menu_category_id')
    .references(() => menuCategories.id, { onDelete: 'cascade' })
    .notNull(),
  ifoodItemId: text('ifood_item_id'),
  ifoodItemCode: text('ifood_item_code'),
  description: text('description').notNull(),
  details: text('details'),
  logoUrl: text('logo_url'),
  logoBase64: text('logo_base64'),
  needChoices: boolean('need_choices').default(false).notNull(),
  unitPrice: integer('unit_price').notNull(),
  unitMinPrice: integer('unit_min_price'),
  unitOriginalPrice: integer('unit_original_price'),
  promotionTags: text('promotion_tags').array(),
  displayOrder: integer('display_order').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  portionSizeTag: portionSizeEnum('portion_size_tag')
    .notNull()
    .default(EPortionSize.NOT_APPLICABLE),

  dietaryRestrictions: dietaryRestrictionEnum('dietary_restrictions')
    .array()
    .default([]),

  dishClassifications: dishClassificationEnum('dish_classifications')
    .array()
    .default([]),

  tags: text('tags').array().default([]),

  ...timestamps,
})

export const itemsRelations = relations(items, ({ one, many }) => ({
  menuCategory: one(menuCategories, {
    fields: [items.menuCategoryId],
    references: [menuCategories.id],
  }),
  productInfo: one(productInfo, {
    fields: [items.id],
    references: [productInfo.itemId],
  }),
  choices: many(choices),
  sellingOption: one(sellingOptions, {
    fields: [items.id],
    references: [sellingOptions.itemId],
  }),
  productAisles: many(productAisles),
}))

export type Item = typeof items.$inferSelect
export type NewItem = typeof items.$inferInsert
