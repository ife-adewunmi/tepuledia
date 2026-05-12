import { BaseRepository } from '@lumiarq/framework'
import { eq, and, gt }   from 'drizzle-orm'
import type {
  ISessionRepository,
  Session,
  CreateSessionData,
} from '@lumiarq/framework/auth'
import { sessions, type SessionRow } from '../schemas/session.schema'

function toModel(row: SessionRow): Session {
  return {
    id:        row.id,
    userId:    row.userId,
    tokenHash: row.tokenHash,
    expiresAt: row.expiresAt,
    createdAt: row.createdAt,
  }
}

export class SessionRepository
  extends BaseRepository<Session, CreateSessionData>
  implements ISessionRepository
{
  async create(data: CreateSessionData): Promise<Session> {
    const [row] = await this.db
      .insert(sessions)
      .values({
        id:        crypto.randomUUID(),
        userId:    data.userId,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
        createdAt: new Date(),
      })
      .returning()
    return toModel(row!)
  }

  async findByToken(tokenHash: string): Promise<Session | null> {
    const now = new Date()
    const [row] = await this.db
      .select()
      .from(sessions)
      .where(and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, now)))
      .limit(1)
    return row ? toModel(row) : null
  }

  async revoke(sessionId: string): Promise<void> {
    await this.db.delete(sessions).where(eq(sessions.id, sessionId))
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.db.delete(sessions).where(eq(sessions.userId, userId))
  }

  // ── BaseRepository abstract method implementations ──────────────────────────

  async findById(id: string): Promise<Session | null> {
    const [row] = await this.db.select().from(sessions).where(eq(sessions.id, id)).limit(1)
    return row ? toModel(row) : null
  }

  async findAll(opts?: { limit?: number; offset?: number }): Promise<Session[]> {
    const rows = await this.db
      .select()
      .from(sessions)
      .limit(opts?.limit ?? 50)
      .offset(opts?.offset ?? 0)
    return rows.map(toModel)
  }

  async update(id: string, data: Partial<CreateSessionData>): Promise<Session> {
    const [row] = await this.db
      .update(sessions)
      .set(data)
      .where(eq(sessions.id, id))
      .returning()
    return toModel(row!)
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(sessions).where(eq(sessions.id, id))
  }
}
