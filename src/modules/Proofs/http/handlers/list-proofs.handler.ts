import { defineHandler }         from '@lumiarq/framework'
import { ProofRepository }       from '@/modules/Proofs/database/repositories/proof.repository'
import { PracticePathRepository } from '@/modules/Paths/Practice/database/repositories/practice-path.repository'

const proofRepo = new ProofRepository()
const pathRepo  = new PracticePathRepository()

export const ListProofsHandler = defineHandler(async (ctx) => {
  const practicePathId = ctx.req.param('practicePathId')
  const userId         = ctx.get('userId') as string

  const path = await pathRepo.findById(practicePathId)
  if (!path) return ctx.json({ message: 'Not found' }, 404)

  // Non-public paths: only owner can view proofs
  if (!path.isPublic && path.userId !== userId) {
    return ctx.json({ message: 'Not found' }, 404)
  }

  const proofs = await proofRepo.findByPracticePathId(practicePathId)
  return ctx.json({ data: proofs })
})
