import { defineHandler, sanitizeObject } from '@lumiarq/framework'
import { ZodError }                       from 'zod'
import { SubmitProofSchema }              from '@/modules/Proofs/contracts/dto/submit-proof.dto'
import { SubmitProofAction }              from '@/modules/Proofs/logic/actions/submit-proof.action'

export const SubmitProofHandler = defineHandler(async (ctx) => {
  const userId = ctx.get('userId') as string
  const body   = sanitizeObject((await ctx.req.json()) as Record<string, unknown>)

  let dto
  try {
    dto = SubmitProofSchema.parse(body)
  } catch (err) {
    if (err instanceof ZodError) {
      return ctx.json({ message: 'Validation failed', errors: err.flatten().fieldErrors }, 422)
    }
    throw err
  }

  try {
    const proof = await SubmitProofAction({ ...dto, userId })
    return ctx.json({ data: proof }, 201)
  } catch (err) {
    if (err instanceof Error && err.message === 'Forbidden') {
      return ctx.json({ message: 'Forbidden' }, 403)
    }
    if (err instanceof Error && err.message === 'Practice path not found') {
      return ctx.json({ message: 'Not found' }, 404)
    }
    if (err instanceof Error && err.message === 'Practice path is not active') {
      return ctx.json({ message: 'Practice path is not active' }, 409)
    }
    throw err
  }
})
