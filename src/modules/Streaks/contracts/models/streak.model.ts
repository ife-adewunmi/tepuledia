export interface Streak {
  id:             string
  practicePathId: string
  userId:         string
  currentStreak:  number
  longestStreak:  number
  lastProofDate:  Date | null
  updatedAt:      Date
}
