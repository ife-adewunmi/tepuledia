import { UserRepository }  from '@/modules/User/database/repositories/user.repository'
import type { UserProfile } from '@/modules/User/contracts/models/user.model'

const repo = new UserRepository()

export async function GetPublicProfileQuery(username: string): Promise<UserProfile | null> {
  return repo.findByUsername(username)
}

export async function GetProfileByIdentityQuery(identityId: string): Promise<UserProfile | null> {
  return repo.findByIdentityId(identityId)
}
