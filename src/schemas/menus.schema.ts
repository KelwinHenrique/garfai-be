import {
  pgTable,
  uuid,
  text,
  jsonb,
  boolean,
  timestamp,
  varchar,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { environments } from './environments.schema'
import timestamps from './utils/timestamps'
import { relations } from 'drizzle-orm'
import { menuCategories } from './menuCategories.schema'
import { EImportMenuStatus } from '../types/menus/IMenu'

export const menuStatusEnum = pgEnum('menuStatusEnum', EImportMenuStatus)

export const menus = pgTable('menus', {
  id: uuid('id').primaryKey().defaultRandom(),
  environmentId: uuid('environment_id')
    .references(() => environments.id, { onDelete: 'cascade' })
    .notNull(),
  ifoodMerchantId: text('ifood_merchant_id'),
  rawCatalogData: jsonb('raw_catalog_data'),
  isActive: boolean('is_active').default(false).notNull(),
  name: varchar('name', { length: 255 }),
  importedAt: timestamp('imported_at'),
  menuStatus: menuStatusEnum('menu_status').default(
    EImportMenuStatus.NOT_IMPORTED,
  ),
  ...timestamps,
})

export const menusRelations = relations(menus, ({ one, many }) => ({
  environment: one(environments, {
    fields: [menus.environmentId],
    references: [environments.id],
  }),
  menuCategories: many(menuCategories),
}))

export type Menu = typeof menus.$inferSelect
export type NewMenu = typeof menus.$inferInsert
