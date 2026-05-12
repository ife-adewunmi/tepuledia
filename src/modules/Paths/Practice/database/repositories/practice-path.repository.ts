import { BaseRepository }      from '@lumiarq/framework/database'
import { eq, and, desc }       from 'drizzle-orm'
import type { PracticePath, PathStatus } from '@/modules/Paths/Practice/contracts/models/practice-path.model'
import { practicePaths, type PracticePathRow } from '../schemas/practice-path.schema'

function toModel(row: PracticePathRow): PracticePath {
  return {
    id:            row.id,
    userId:        row.userId,
    title:         row.title,
    commitment:    row.commitment,
    description:   row.description,
    durationDays:  row.durationDays,
    frequency:     row.frequency,
    proofFormat:   row.proofFormat,
    proofStandard: row.proofStandard,
    status:        row.status,
    isPublic:      row.isPublic,
    startedAt:     row.startedAt,
    completedAt:   row.completedAt,
    createdAt:     row.createdAt,
    updatedAt:     row.updatedAt,
  }
}

export class PracticePathRepository extends BaseRepository<PracticePath, Omit<PracticePath, 'id' | 'createdAt' | 'updatedAt'>> {
  async create(data: Omit<PracticePath, 'createdAt' | 'updatedAt'>): Promise<PracticePath> {
    const now = new Date()
    const [row] = await this.db
      .insert(practicePaths)
      .values({ ...data, createdAt: now, updatedAt: now })
      .returning()
    return toModel(row!)
  }

  async findById(id: string): Promise<PracticePath | null> {
    const [row] = await this.db
      .select()
      .from(practicePaths)
      .where(eq(practicePaths.id, id))
      .limit(1)
    return row ? toModel(row) : null
  }

  async findByUserId(userId: string, opts?: { limit?: number; offset?: number }): Promise<PracticePath[]> {
    const rows = await this.db
      .select()
      .from(practicePaths)
      .where(eq(practicePaths.userId, userId))
      .orderBy(desc(practicePaths.createdAt))
      .limit(opts?.limit ?? 20)
      .offset(opts?.offset ?? 0)
    return rows.map(toModel)
  }

  async findPublic(opts?: { limit?: number; offset?: number }): Promise<PracticePath[]> {
    const rows = await this.db
      .select()
      .from(practicePaths)
      .where(and(eq(practicePaths.isPublic, true), eq(practicePaths.status, 'active')))
      .orderBy(desc(practicePaths.createdAt))
      .limit(opts?.limit ?? 20)
      .offset(opts?.offset ?? 0)
    return rows.map(toModel)
  }

  async updateStatus(id: string, status: PathStatus, completedAt?: Date): Promise<void> {
    await this.db
      .update(practicePaths)
      .set({ status, completedAt: completedAt ?? null, updatedAt: new Date() })
      .where(eq(practicePaths.id, id))
  }

  async update(id: string, data: Partial<Pick<PracticePath, 'title' | 'commitment' | 'description' | 'proofStandard' | 'isPublic'>>): Promise<PracticePath> {
    const [row] = await this.db
      .update(practicePaths)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(practicePaths.id, id))
      .returning()
    return toModel(row!)
  }

  async findAll(opts?: { limit?: number; offset?: number }): Promise<PracticePath[]> {
    const rows = await this.db
      .select()
      .from(practicePaths)
      .orderBy(desc(practicePaths.createdAt))
      .limit(opts?.limit ?? 50)
      .offset(opts?.offset ?? 0)
    return rows.map(toModel)
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(practicePaths).where(eq(practicePaths.id, id))
  }
}
