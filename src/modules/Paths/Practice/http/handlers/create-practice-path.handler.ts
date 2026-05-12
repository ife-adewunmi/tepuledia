import { defineHandler, sanitizeObject } from '@lumiarq/framework'
import { ZodError }                       from 'zod'
import { CreatePracticePathSchema }       from '@/modules/Paths/Practice/contracts/dto/practice-path.dto'
import { CreatePracticePathAction }       from '@/modules/Paths/Practice/logic/actions/create-practice-path.action'

export const CreatePracticePathHandler = defineHandler(async (ctx) => {
  const userId = ctx.get('userId') as string
  const body   = sanitizeObject((await ctx.req.json()) as Record<string, unknown>)

  let dto
  try {
    dto = CreatePracticePathSchema.parse(body)
  } catch (err) {
    if (err instanceof ZodError) {
      return ctx.json({ message: 'Validation failed', errors: err.flatten().fieldErrors }, 422)
    }
    throw err
  }

  const path = await CreatePracticePathAction({ ...dto, userId })
  return ctx.json({ data: path }, 201)
})
