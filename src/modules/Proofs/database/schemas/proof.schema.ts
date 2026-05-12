import { sql } from 'drizzle-orm'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { practicePaths } from '@/modules/Paths/Practice/database/schemas/practice-path.schema'
import { userProfiles }  from '@/modules/User/database/schemas/user.schema'

export const proofs = sqliteTable('proofs', {
  id:             text('id').primaryKey(),
  practicePathId: text('practice_path_id').notNull()
                    .references(() => practicePaths.id, { onDelete: 'cascade' }),
  userId:         text('user_id').notNull()
                    .references(() => userProfiles.id, { onDelete: 'cascade' }),
  dayNumber:      integer('day_number').notNull(),
  content:        text('content'),       // text proof or URL
  mediaUrl:       text('media_url'),     // uploaded file URL
  mediaType:      text('media_type', { enum: ['image', 'video', 'voice', 'file'] }),
  caption:        text('caption'),
  isPublic:       integer('is_public', { mode: 'boolean' }).notNull().default(true),
  postedAt:       integer('posted_at', { mode: 'timestamp_ms' }).notNull()
                    .default(sql`(unixepoch() * 1000)`),
  createdAt:      integer('created_at', { mode: 'timestamp_ms' }).notNull()
                    .default(sql`(unixepoch() * 1000)`),
})

export type ProofRow    = typeof proofs.$inferSelect
export type NewProofRow = typeof proofs.$inferInsert
