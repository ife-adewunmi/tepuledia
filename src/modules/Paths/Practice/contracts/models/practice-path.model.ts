export type ProofFormat = 'image' | 'video' | 'voice' | 'link' | 'text' | 'file'
export type PathStatus  = 'active' | 'completed' | 'abandoned'

export interface PracticePath {
  id:            string
  userId:        string
  title:         string
  commitment:    string
  description:   string | null
  durationDays:  number
  frequency:     number
  proofFormat:   ProofFormat
  proofStandard: string
  status:        PathStatus
  isPublic:      boolean
  startedAt:     Date
  completedAt:   Date | null
  createdAt:     Date
  updatedAt:     Date
}
