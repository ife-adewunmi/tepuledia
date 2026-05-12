import { defineHandler, sanitizeObject } from '@lumiarq/framework'
import { ZodError }                       from 'zod'
import { RegisterValidator }              from '@/modules/Auth/contracts/validators/register.validator'
import { RegisterAction }                 from '@/modules/Auth/logic/actions/register.action'

export const RegisterHandler = defineHandler(async (ctx) => {
  const body = sanitizeObject((await ctx.req.json()) as Record<string, unknown>)

  let input
  try {
    input = RegisterValidator.parse(body)
  } catch (err) {
    if (err instanceof ZodError) {
      return ctx.json({ message: 'Validation failed', errors: err.flatten().fieldErrors }, 422)
    }
    throw err
  }

  const identity = await RegisterAction(input)

  return ctx.json({ id: identity.id, email: identity.email }, 201)
})
