import { BaseRepository }           from '@lumiarq/framework'
import { eq }                        from 'drizzle-orm'
import type { Streak }               from '@/modules/Streaks/contracts/models/streak.model'
import { streaks, type StreakRow }   from '../schemas/streak.schema'

function toModel(row: StreakRow): Streak {
  return {
    id:             row.id,
    practicePathId: row.practicePathId,
    userId:         row.userId,
    currentStreak:  row.currentStreak,
    longestStreak:  row.longestStreak,
    lastProofDate:  row.lastProofDate,
    updatedAt:      row.updatedAt,
  }
}

export class StreakRepository extends BaseRepository<Streak, Omit<Streak, 'updatedAt'>> {
  async create(data: Omit<Streak, 'updatedAt'>): Promise<Streak> {
    const [row] = await this.db
      .insert(streaks)
      .values({ ...data, updatedAt: new Date() })
      .returning()
    return toModel(row!)
  }

  async findByPracticePathId(practicePathId: string): Promise<Streak | null> {
    const [row] = await this.db
      .select()
      .from(streaks)
      .where(eq(streaks.practicePathId, practicePathId))
      .limit(1)
    return row ? toModel(row) : null
  }

  async update(
    practicePathId: string,
    data: Pick<Streak, 'currentStreak' | 'longestStreak' | 'lastProofDate'>,
  ): Promise<Streak> {
    const [row] = await this.db
      .update(streaks)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(streaks.practicePathId, practicePathId))
      .returning()
    return toModel(row!)
  }

  async resetStalestStreaks(before: Date): Promise<void> {
    const rows = await this.db.select().from(streaks)
    const stale = rows.filter(
      (r) => r.lastProofDate !== null && r.lastProofDate < before && r.currentStreak > 0,
    )
    for (const row of stale) {
      await this.db
        .update(streaks)
        .set({ currentStreak: 0, updatedAt: new Date() })
        .where(eq(streaks.id, row.id))
    }
  }

  // ── BaseRepository abstract method implementations ──────────────────────────

  async findById(id: string): Promise<Streak | null> {
    const [row] = await this.db.select().from(streaks).where(eq(streaks.id, id)).limit(1)
    return row ? toModel(row) : null
  }

  async findAll(opts?: { limit?: number; offset?: number }): Promise<Streak[]> {
    const rows = await this.db
      .select()
      .from(streaks)
      .limit(opts?.limit ?? 50)
      .offset(opts?.offset ?? 0)
    return rows.map(toModel)
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(streaks).where(eq(streaks.id, id))
  }
}
