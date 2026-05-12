import { BaseRepository } from '@lumiarq/framework'
import { proofs }         from '@/modules/Proofs/database/schemas/proof.schema'
import { userProfiles }   from '@/modules/User/database/schemas/user.schema'
import { eq, desc }       from 'drizzle-orm'
import type { FeedItem }  from '@/modules/Feed/contracts/models/feed-item.model'

export class FeedRepository extends BaseRepository<FeedItem, FeedItem> {
  async findPublicFeed({
    limit = 20,
    cursor,
  }: {
    limit?: number
    cursor?: string
  }): Promise<FeedItem[]> {
    const rows = await this.db
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

  async findById(id: string): Promise<FeedItem | null> {
    const rows = await this.db
      .select()
      .from(proofs)
      .where(eq(proofs.id, id))
      .limit(1)
    return (rows[0] as unknown as FeedItem) ?? null
  }

  async findAll(): Promise<FeedItem[]> {
    return (await this.db.select().from(proofs)) as unknown as FeedItem[]
  }

  async create(data: FeedItem): Promise<FeedItem> {
    return data
  }

  async update(_id: string, data: FeedItem): Promise<FeedItem> {
    return data
  }

  async delete(_id: string): Promise<void> {
    // no-op for feed read model
  }
}
