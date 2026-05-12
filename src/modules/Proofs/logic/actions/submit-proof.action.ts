import { defineAction, eventBus }    from '@lumiarq/framework'
import { ProofRepository }           from '@/modules/Proofs/database/repositories/proof.repository'
import { PracticePathRepository }    from '@/modules/Paths/Practice/database/repositories/practice-path.repository'
import { UpdateStreakAction }         from '@/modules/Streaks/logic/actions/update-streak.action'
import { ProofSubmitted }            from '@/modules/Proofs/events/definitions/proof-submitted.event'
import type { SubmitProofDto }        from '@/modules/Proofs/contracts/dto/submit-proof.dto'
import type { Proof }                 from '@/modules/Proofs/contracts/models/proof.model'

const proofRepo = new ProofRepository()
const pathRepo  = new PracticePathRepository()

export const SubmitProofAction = defineAction(
  async (dto: SubmitProofDto & { userId: string }): Promise<Proof> => {
    const path = await pathRepo.findById(dto.practicePathId)
    if (!path) throw new Error('Practice path not found')
    if (path.userId !== dto.userId) throw new Error('Forbidden')
    if (path.status !== 'active') throw new Error('Practice path is not active')

    const proof = await proofRepo.create({
      id:             crypto.randomUUID(),
      practicePathId: dto.practicePathId,
      userId:         dto.userId,
      dayNumber:      dto.dayNumber,
      content:        dto.content ?? null,
      mediaUrl:       dto.mediaUrl ?? null,
      mediaType:      dto.mediaType ?? null,
      caption:        dto.caption ?? null,
      isPublic:       dto.isPublic,
      postedAt:       new Date(),
    })

    // Update streak
    await UpdateStreakAction(dto.practicePathId, dto.userId, proof.postedAt)

    // Emit event for reputation and other listeners
    await eventBus.emit(ProofSubmitted, {
      proofId:        proof.id,
      userId:         dto.userId,
      practicePathId: dto.practicePathId,
      isPublic:       dto.isPublic,
    })

    // Check for completion: total proofs >= durationDays * frequency
    const totalProofs = await proofRepo.countByPracticePathId(dto.practicePathId)
    const required    = path.durationDays * path.frequency
    if (totalProofs >= required) {
      await pathRepo.updateStatus(dto.practicePathId, 'completed', new Date())
    }

    return proof
  },
)
