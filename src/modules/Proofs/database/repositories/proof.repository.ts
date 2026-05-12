import { BaseRepository }     from '@lumiarq/framework'
import { eq, desc }           from 'drizzle-orm'
import type { Proof }         from '@/modules/Proofs/contracts/models/proof.model'
import { proofs, type ProofRow } from '../schemas/proof.schema'

function toModel(row: ProofRow): Proof {
  return {
    id:             row.id,
    practicePathId: row.practicePathId,
    userId:         row.userId,
    dayNumber:      row.dayNumber,
    content:        row.content,
    mediaUrl:       row.mediaUrl,
    mediaType:      row.mediaType,
    caption:        row.caption,
    isPublic:       row.isPublic,
    postedAt:       row.postedAt,
    createdAt:      row.createdAt,
  }
}

export class ProofRepository extends BaseRepository<Proof, Omit<Proof, 'createdAt'>> {
  async create(data: Omit<Proof, 'createdAt'>): Promise<Proof> {
    const [row] = await this.db
      .insert(proofs)
      .values({ ...data, createdAt: new Date() })
      .returning()
    return toModel(row!)
  }

  async findById(id: string): Promise<Proof | null> {
    const [row] = await this.db.select().from(proofs).where(eq(proofs.id, id)).limit(1)
    return row ? toModel(row) : null
  }

  async findByPracticePathId(practicePathId: string): Promise<Proof[]> {
    const rows = await this.db
      .select()
      .from(proofs)
      .where(eq(proofs.practicePathId, practicePathId))
      .orderBy(desc(proofs.postedAt))
    return rows.map(toModel)
  }

  async countByPracticePathId(practicePathId: string): Promise<number> {
    const rows = await this.db
      .select()
      .from(proofs)
      .where(eq(proofs.practicePathId, practicePathId))
    return rows.length
  }

  async findByUserId(userId: string, opts?: { limit?: number; offset?: number }): Promise<Proof[]> {
    const rows = await this.db
      .select()
      .from(proofs)
      .where(eq(proofs.userId, userId))
      .orderBy(desc(proofs.postedAt))
      .limit(opts?.limit ?? 20)
      .offset(opts?.offset ?? 0)
    return rows.map(toModel)
  }

  // ── BaseRepository abstract method implementations ──────────────────────────

  async findAll(opts?: { limit?: number; offset?: number }): Promise<Proof[]> {
    const rows = await this.db
      .select()
      .from(proofs)
      .orderBy(desc(proofs.postedAt))
      .limit(opts?.limit ?? 20)
      .offset(opts?.offset ?? 0)
    return rows.map(toModel)
  }

  async update(id: string, data: Partial<Omit<Proof, 'createdAt'>>): Promise<Proof> {
    const [row] = await this.db
      .update(proofs)
      .set(data)
      .where(eq(proofs.id, id))
      .returning()
    return toModel(row!)
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(proofs).where(eq(proofs.id, id))
  }
}
