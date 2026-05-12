import { defineAction } from '@lumiarq/framework'
import { FeedRepository } from '@/modules/Feed/database/repositories/feed.repository'
import type { FeedItem }  from '@/modules/Feed/contracts/models/feed-item.model'

interface GetFeedInput {
  limit?: number
  cursor?: string
}

interface GetFeedResult {
  items: FeedItem[]
  nextCursor: string | null
}

export const GetFeedQuery = defineAction(
  async (input: GetFeedInput): Promise<GetFeedResult> => {
    const limit = Math.min(input.limit ?? 20, 50)
    const feedRepo = new FeedRepository()

    const items = await feedRepo.findPublicFeed({
      limit: limit + 1,
      cursor: input.cursor,
    })

    const hasMore = items.length > limit
    const page = hasMore ? items.slice(0, limit) : items
    const nextCursor = hasMore ? (page[page.length - 1]?.id ?? null) : null

    return { items: page, nextCursor }
  },
)
