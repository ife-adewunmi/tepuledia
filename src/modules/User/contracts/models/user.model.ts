export interface UserProfile {
  id:             string
  identityId:     string
  username:       string
  displayName:    string
  bio:            string | null
  avatarUrl:      string | null
  reputationScore: number
  createdAt:      Date
  updatedAt:      Date
}
