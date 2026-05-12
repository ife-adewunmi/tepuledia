import { sql } from 'drizzle-orm'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { identities } from '@/modules/Auth/database/schemas/identity.schema'

/**
 * user_profiles is a 1-to-1 extension of identities.
 * Auth owns identity (email/password). User owns profile (public-facing data).
 */
export const userProfiles = sqliteTable('user_profiles', {
  id:             text('id').primaryKey(),
  identityId:     text('identity_id').notNull().unique()
                    .references(() => identities.id, { onDelete: 'cascade' }),
  username:       text('username').notNull().unique(),
  displayName:    text('display_name').notNull().default(''),
  bio:            text('bio'),
  avatarUrl:      text('avatar_url'),
  reputationScore: integer('reputation_score').notNull().default(0),
  createdAt:      integer('created_at', { mode: 'timestamp_ms' }).notNull()
                    .default(sql`(unixepoch() * 1000)`),
  updatedAt:      integer('updated_at', { mode: 'timestamp_ms' }).notNull()
                    .default(sql`(unixepoch() * 1000)`),
})

export type UserProfileRow    = typeof userProfiles.$inferSelect
export type NewUserProfileRow = typeof userProfiles.$inferInsert
