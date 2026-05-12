import { sql } from 'drizzle-orm'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { userProfiles } from '@/modules/User/database/schemas/user.schema'

export const practicePaths = sqliteTable('practice_paths', {
  id:            text('id').primaryKey(),
  userId:        text('user_id').notNull()
                   .references(() => userProfiles.id, { onDelete: 'cascade' }),
  title:         text('title').notNull(),
  commitment:    text('commitment').notNull(),
  description:   text('description'),
  durationDays:  integer('duration_days').notNull(),
  frequency:     integer('frequency').notNull().default(1),  // proofs required per day
  proofFormat:   text('proof_format', {
                   enum: ['image', 'video', 'voice', 'link', 'text', 'file'],
                 }).notNull(),
  proofStandard: text('proof_standard').notNull(),
  status:        text('status', {
                   enum: ['active', 'completed', 'abandoned'],
                 }).notNull().default('active'),
  isPublic:      integer('is_public', { mode: 'boolean' }).notNull().default(true),
  startedAt:     integer('started_at', { mode: 'timestamp_ms' }).notNull()
                   .default(sql`(unixepoch() * 1000)`),
  completedAt:   integer('completed_at', { mode: 'timestamp_ms' }),
  createdAt:     integer('created_at', { mode: 'timestamp_ms' }).notNull()
                   .default(sql`(unixepoch() * 1000)`),
  updatedAt:     integer('updated_at', { mode: 'timestamp_ms' }).notNull()
                   .default(sql`(unixepoch() * 1000)`),
})

export type PracticePathRow    = typeof practicePaths.$inferSelect
export type NewPracticePathRow = typeof practicePaths.$inferInsert
