import { defineAction }  from '@lumiarq/framework'
import { UserRepository } from '@/modules/User/database/repositories/user.repository'

const repo = new UserRepository()

export interface CreateUserProfileDto {
  identityId:  string
  email:       string
  displayName?: string
}

export const CreateUserProfileAction = defineAction(
  async (dto: CreateUserProfileDto) => {
    // Derive a default username from email (slug-safe, unique suffix if needed)
    const base     = dto.email.split('@')[0]?.replace(/[^a-z0-9]/gi, '').toLowerCase() ?? 'user'
    const username = `${base}_${Date.now().toString(36)}`

    return repo.create({
      identityId:     dto.identityId,
      username,
      displayName:    dto.displayName ?? base,
      bio:            null,
      avatarUrl:      null,
      reputationScore: 0,
    })
  },
)
