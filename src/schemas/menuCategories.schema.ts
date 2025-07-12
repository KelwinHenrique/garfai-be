// db/schemas/menu_categories.ts
import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { menus } from './menus.schema'
import timestamps from './utils/timestamps'
import { environments } from './environments.schema'
import { relations } from 'drizzle-orm'
import { items } from './items.schema'
import { EMenuCategoryType } from '../types/menus/IMenu'

export const categoryTypeEnum = pgEnum('categoryType', EMenuCategoryType)

export const menuCategories = pgTable('menu_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  environmentId: uuid('environment_id')
    .references(() => environments.id, { onDelete: 'cascade' })
    .notNull(),
  menuId: uuid('menu_id')
    .references(() => menus.id, { onDelete: 'cascade' })
    .notNull(),
  ifoodMenuCode: text('ifood_menu_code'),
  name: varchar('name', { length: 255 }).notNull(),
  displayOrder: integer('display_order').notNull().default(0),
  isActive: boolean('is_active').default(true).notNull(),
  categoryType: categoryTypeEnum('category_type')
    .notNull()
    .default(EMenuCategoryType.MAIN_ITEMS),
  ...timestamps,
})

export const menuCategoriesRelations = relations(
  menuCategories,
  ({ one, many }) => ({
    menu: one(menus, {
      fields: [menuCategories.menuId],
      references: [menus.id],
    }),
    items: many(items),
  }),
)

export type MenuCategory = typeof menuCategories.$inferSelect
export type NewMenuCategory = typeof menuCategories.$inferInsert
