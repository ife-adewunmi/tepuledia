import { defineAction }              from '@lumiarq/framework'
import { BaseResetPasswordAction }   from '@lumiarq/framework/auth'
import { IdentityRepository }        from '@/modules/Auth/database/repositories/identity.repository'
import { PasswordResetRepository }   from '@/modules/Auth/database/repositories/password-reset.repository'

const identityRepo      = new IdentityRepository()
const passwordResetRepo = new PasswordResetRepository()

export const ResetPasswordAction = defineAction(
  async (input: { token: string; newPassword: string }): Promise<void> => {
    const resetRecord = await passwordResetRepo.findValidByToken(input.token)

    if (!resetRecord) {
      throw Object.assign(new Error('Invalid or expired reset token.'), { status: 422 })
    }

    await BaseResetPasswordAction(
      { userId: resetRecord.identityId, newPassword: input.newPassword },
      { identityRepo },
    )

    await passwordResetRepo.markUsed(resetRecord.id)
  },
)
