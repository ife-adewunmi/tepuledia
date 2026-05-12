import { defineHandler, sanitizeObject } from '@lumiarq/framework'
import { ZodError }                       from 'zod'
import { UpdatePracticePathSchema }       from '@/modules/Paths/Practice/contracts/dto/practice-path.dto'
import { UpdatePracticePathAction }       from '@/modules/Paths/Practice/logic/actions/update-practice-path.action'

export const UpdatePracticePathHandler = defineHandler(async (ctx) => {
  const id     = ctx.req.param('id')
  const userId = ctx.get('userId') as string
  const body   = sanitizeObject((await ctx.req.json()) as Record<string, unknown>)

  let dto
  try {
    dto = UpdatePracticePathSchema.parse(body)
  } catch (err) {
    if (err instanceof ZodError) {
      return ctx.json({ message: 'Validation failed', errors: err.flatten().fieldErrors }, 422)
    }
    throw err
  }

  try {
    const path = await UpdatePracticePathAction(id, userId, dto)
    return ctx.json({ data: path })
  } catch (err) {
    if (err instanceof Error && err.message === 'Forbidden') {
      return ctx.json({ message: 'Forbidden' }, 403)
    }
    if (err instanceof Error && err.message === 'Practice path not found') {
      return ctx.json({ message: 'Not found' }, 404)
    }
    throw err
  }
})
