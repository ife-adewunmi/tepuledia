import { BaseRepository }      from '@lumiarq/framework'
import { eq, and, gt, isNull } from 'drizzle-orm'
import { passwordResets, type PasswordResetRow } from '../schemas/password-reset.schema'

export interface PasswordResetData {
  identityId: string
  token:      string
  expiresAt:  Date
}

export type PasswordReset = {
  id:         string
  identityId: string
  token:      string
  expiresAt:  Date
  usedAt:     Date | null
  createdAt:  Date
}

function toModel(row: PasswordResetRow): PasswordReset {
  return {
    id:         row.id,
    identityId: row.identityId,
    token:      row.token,
    expiresAt:  row.expiresAt,
    usedAt:     row.usedAt,
    createdAt:  row.createdAt,
  }
}

export class PasswordResetRepository
  extends BaseRepository<PasswordReset, PasswordResetData>
{
  async create(data: PasswordResetData): Promise<PasswordReset> {
    const [row] = await this.db
      .insert(passwordResets)
      .values({
        id:         crypto.randomUUID(),
        identityId: data.identityId,
        token:      data.token,
        expiresAt:  data.expiresAt,
        createdAt:  new Date(),
      })
      .returning()
    return toModel(row!)
  }

  /** Find a valid (unexpired, unused) reset record by raw token. */
  async findValidByToken(token: string): Promise<PasswordReset | null> {
    const now = new Date()
    const [row] = await this.db
      .select()
      .from(passwordResets)
      .where(
        and(
          eq(passwordResets.token, token),
          gt(passwordResets.expiresAt, now),
          isNull(passwordResets.usedAt),
        ),
      )
      .limit(1)
    return row ? toModel(row) : null
  }

  /** Mark a reset token as consumed. */
  async markUsed(id: string): Promise<void> {
    await this.db
      .update(passwordResets)
      .set({ usedAt: new Date() })
      .where(eq(passwordResets.id, id))
  }

  // ── BaseRepository abstract method implementations ──────────────────────────

  async findById(id: string): Promise<PasswordReset | null> {
    const [row] = await this.db
      .select().from(passwordResets).where(eq(passwordResets.id, id)).limit(1)
    return row ? toModel(row) : null
  }

  async findAll(opts?: { limit?: number; offset?: number }): Promise<PasswordReset[]> {
    const rows = await this.db
      .select().from(passwordResets)
      .limit(opts?.limit ?? 50)
      .offset(opts?.offset ?? 0)
    return rows.map(toModel)
  }

  async update(id: string, data: Partial<PasswordResetData>): Promise<PasswordReset> {
    const [row] = await this.db
      .update(passwordResets)
      .set(data)
      .where(eq(passwordResets.id, id))
      .returning()
    return toModel(row!)
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(passwordResets).where(eq(passwordResets.id, id))
  }
}
