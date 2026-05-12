import { sql } from 'drizzle-orm'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { practicePaths } from '@/modules/Paths/Practice/database/schemas/practice-path.schema'
import { userProfiles }  from '@/modules/User/database/schemas/user.schema'

export const streaks = sqliteTable('streaks', {
  id:             text('id').primaryKey(),
  practicePathId: text('practice_path_id').notNull().unique()
                    .references(() => practicePaths.id, { onDelete: 'cascade' }),
  userId:         text('user_id').notNull()
                    .references(() => userProfiles.id, { onDelete: 'cascade' }),
  currentStreak:  integer('current_streak').notNull().default(0),
  longestStreak:  integer('longest_streak').notNull().default(0),
  lastProofDate:  integer('last_proof_date', { mode: 'timestamp_ms' }),
  updatedAt:      integer('updated_at', { mode: 'timestamp_ms' }).notNull()
                    .default(sql`(unixepoch() * 1000)`),
})

export type StreakRow    = typeof streaks.$inferSelect
export type NewStreakRow = typeof streaks.$inferInsert
