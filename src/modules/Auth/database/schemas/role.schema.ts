import { sql } from 'drizzle-orm'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const roles = sqliteTable('roles', {
  id:        text('id').primaryKey(),
  name:      text('name').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull()
               .default(sql`(unixepoch() * 1000)`),
})

export type RoleRow = typeof roles.$inferSelect
