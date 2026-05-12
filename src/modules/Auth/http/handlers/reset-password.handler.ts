import { defineHandler, sanitizeObject } from '@lumiarq/framework'
import { ZodError }                       from 'zod'
import { ResetPasswordValidator }         from '@/modules/Auth/contracts/validators/reset-password.validator'
import { ResetPasswordAction }            from '@/modules/Auth/logic/actions/reset-password.action'

export const ResetPasswordHandler = defineHandler(async (ctx) => {
  const body = sanitizeObject((await ctx.req.json()) as Record<string, unknown>)

  let input
  try {
    input = ResetPasswordValidator.parse(body)
  } catch (err) {
    if (err instanceof ZodError) {
      return ctx.json({ message: 'Validation failed', errors: err.flatten().fieldErrors }, 422)
    }
    throw err
  }

  try {
    await ResetPasswordAction({ token: input.token, newPassword: input.password })
  } catch (err: any) {
    if (err?.status === 422) {
      return ctx.json({ message: err.message }, 422)
    }
    throw err
  }

  return ctx.json({ message: 'Password reset successfully.' }, 200)
})
