import { defineAction, eventBus }           from '@lumiarq/framework'
import { BaseRegisterAction, type Identity } from '@lumiarq/framework/auth'
import type { RegisterData }                 from '@/modules/Auth/contracts/validators/register.validator'
import { IdentityRepository }                from '@/modules/Auth/database/repositories/identity.repository'
import { UserRegistered }                    from '@/modules/Auth/events/definitions/user-registered.event'

const identityRepo = new IdentityRepository()

export const RegisterAction = defineAction(
  async (input: RegisterData): Promise<Identity> => {
    const identity = await BaseRegisterAction(input, { identityRepo })

    eventBus.emit(UserRegistered, {
      identityId: identity.id,
      email:      identity.email,
    })

    return identity
  },
)
