import { UserRepository }          from '@/modules/User/database/repositories/user.repository'
import { CreateUserProfileAction } from '@/modules/User/logic/actions/create-user-profile.action'

const repo = new UserRepository()

/**
 * Handles Auth/UserRegistered — creates a User profile for each new identity.
 * Idempotent: no-op if profile already exists.
 */
export async function onUserRegistered(payload: {
  identityId: string
  email:      string
}): Promise<void> {
  const existing = await repo.findByIdentityId(payload.identityId)
  if (existing) return

  await CreateUserProfileAction({
    identityId:  payload.identityId,
    email:       payload.email,
  })
}
