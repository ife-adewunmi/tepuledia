import { defineAction }           from '@lumiarq/framework'
import { BaseForgotPasswordAction } from '@lumiarq/framework/auth'
import { IdentityRepository }       from '@/modules/Auth/database/repositories/identity.repository'

const identityRepo = new IdentityRepository()

export const ForgotPasswordAction = defineAction(
  async (email: string): Promise<void> => {
    // BaseForgotPasswordAction returns { found, token, tokenHash }.
    // We discard the result here — the handler always returns 200 to prevent email enumeration.
    // In production: store tokenHash, send raw token via email.
    await BaseForgotPasswordAction({ email }, { identityRepo })
  },
)
