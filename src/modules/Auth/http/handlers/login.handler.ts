import { defineHandler, sanitizeObject } from '@lumiarq/framework'
import { ZodError }                       from 'zod'
import { LoginValidator }                 from '@/modules/Auth/contracts/validators/login.validator'
import { LoginAction }                    from '@/modules/Auth/logic/actions/login.action'

export const LoginHandler = defineHandler(async (ctx) => {
  const body  = sanitizeObject((await ctx.req.json()) as Record<string, unknown>)

  let input
  try {
    input = LoginValidator.parse(body)
  } catch (err) {
    if (err instanceof ZodError) {
      return ctx.json({ message: 'Validation failed', errors: err.flatten().fieldErrors }, 422)
    }
    throw err
  }

  const result = await LoginAction(input)

  return ctx.json(
    { token: result.token, jwt: result.jwt },
    200,
  )
})
