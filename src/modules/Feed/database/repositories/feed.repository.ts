import { BaseRepository } from '@lumiarq/framework'
import { db }             from '@/bootstrap/database'
import { proofs }         from '@/modules/Proofs/database/schemas/proof.schema'
import { userProfiles }   from '@/modules/User/database/schemas/user.schema'
import { eq, lt, desc }   from 'drizzle-orm'
import type { FeedItem }  from '@/modules/Feed/contracts/models/feed-item.model'

export class FeedRepository extends BaseRepository {
  async findPublicFeed({
    limit = 20,
    cursor,
  }: {
    limit?: number
    cursor?: string
  }): Promise<FeedItem[]> {
    const rows = await db
      .select({
        id:             proofs.id,
        practicePathId: proofs.practicePathId,
        dayNumber:      proofs.dayNumber,
        content:        proofs.content,
        mediaUrl:       proofs.mediaUrl,
        mediaType:      proofs.mediaType,
        caption:        proofs.caption,
        postedAt:       proofs.postedAt,
        authorId:       userProfiles.id,
        username:       userProfiles.username,
        displayName:    userProfiles.displayName,
        avatarUrl:      userProfiles.avatarUrl,
      })
      .from(proofs)
      .innerJoin(userProfiles, eq(proofs.userId, userProfiles.id))
      .where(
        cursor
          ? eq(proofs.isPublic, true)
          : eq(proofs.isPublic, true),
      )
      .orderBy(desc(proofs.postedAt))
      .limit(limit)

    return rows.map(r => ({
      id:             r.id,
      practicePathId: r.practicePathId,
      dayNumber:      r.dayNumber,
      content:        r.content,
      mediaUrl:       r.mediaUrl,
      mediaType:      r.mediaType as FeedItem['mediaType'],
      caption:        r.caption,
      postedAt:       new Date(r.postedAt as unknown as number),
      author: {
        id:          r.authorId,
        username:    r.username,
        displayName: r.displayName,
        avatarUrl:   r.avatarUrl,
      },
    }))
  }

  // --- BaseRepository abstract method implementations ---
  async findById(id: string) {
    const rows = await db
      .select()
      .from(proofs)
      .where(eq(proofs.id, id))
      .limit(1)
    return rows[0] ?? null
  }

  async findAll() {
    return db.select().from(proofs)
  }

  async create(data: Record<string, unknown>) {
    return data
  }

  async update(id: string, data: Record<string, unknown>) {
    return { id, ...data }
  }

  async delete(id: string) {
    return { id }
  }
}
