import { sql } from 'drizzle-orm'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { identities } from './identity.schema'

export const passwordResets = sqliteTable('password_resets', {
  id:         text('id').primaryKey(),
  identityId: text('identity_id').notNull().references(() => identities.id, { onDelete: 'cascade' }),
  token:      text('token').notNull().unique(),
  expiresAt:  integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
  usedAt:     integer('used_at', { mode: 'timestamp_ms' }),
  createdAt:  integer('created_at', { mode: 'timestamp_ms' }).notNull()
                .default(sql`(unixepoch() * 1000)`),
})

export type PasswordResetRow = typeof passwordResets.$inferSelect
