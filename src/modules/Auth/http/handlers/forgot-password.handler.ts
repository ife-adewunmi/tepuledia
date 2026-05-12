import { defineHandler, sanitizeObject } from '@lumiarq/framework'
import { z, ZodError }                   from 'zod'
import { ForgotPasswordAction }          from '@/modules/Auth/logic/actions/forgot-password.action'

const schema = z.object({ email: z.string().email() })

export const ForgotPasswordHandler = defineHandler(async (ctx) => {
  const body = sanitizeObject((await ctx.req.json()) as Record<string, unknown>)

  let input
  try {
    input = schema.parse(body)
  } catch (err) {
    if (err instanceof ZodError) {
      return ctx.json({ message: 'Validation failed', errors: err.flatten().fieldErrors }, 422)
    }
    throw err
  }

  await ForgotPasswordAction(input.email)

  // Always return 200 to prevent email enumeration
  return ctx.json({ message: 'If that email exists, a reset link has been sent.' }, 200)
})
