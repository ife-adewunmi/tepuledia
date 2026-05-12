export interface FeedItem {
  id: string
  practicePathId: string
  dayNumber: number
  content: string | null
  mediaUrl: string | null
  mediaType: 'image' | 'video' | 'voice' | 'file' | null
  caption: string | null
  postedAt: Date
  author: {
    id: string
    username: string
    displayName: string
    avatarUrl: string | null
  }
}
