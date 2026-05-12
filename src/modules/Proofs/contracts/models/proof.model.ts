export type ProofMediaType = 'image' | 'video' | 'voice' | 'file'

export interface Proof {
  id:             string
  practicePathId: string
  userId:         string
  dayNumber:      number
  content:        string | null
  mediaUrl:       string | null
  mediaType:      ProofMediaType | null
  caption:        string | null
  isPublic:       boolean
  postedAt:       Date
  createdAt:      Date
}
