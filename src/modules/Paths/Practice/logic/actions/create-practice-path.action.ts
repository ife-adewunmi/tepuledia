import { defineAction }            from '@lumiarq/framework'
import { PracticePathRepository }  from '@/modules/Paths/Practice/database/repositories/practice-path.repository'
import { InitialiseStreakAction }   from '@/modules/Streaks/logic/actions/update-streak.action'
import type { CreatePracticePathDto } from '@/modules/Paths/Practice/contracts/dto/practice-path.dto'
import type { PracticePath }          from '@/modules/Paths/Practice/contracts/models/practice-path.model'

const repo = new PracticePathRepository()

export const CreatePracticePathAction = defineAction(
  async (dto: CreatePracticePathDto & { userId: string }): Promise<PracticePath> => {
    const path = await repo.create({
      id:            crypto.randomUUID(),
      userId:        dto.userId,
      title:         dto.title,
      commitment:    dto.commitment,
      description:   dto.description ?? null,
      durationDays:  dto.durationDays,
      frequency:     dto.frequency,
      proofFormat:   dto.proofFormat,
      proofStandard: dto.proofStandard,
      status:        'active',
      isPublic:      dto.isPublic,
      startedAt:     new Date(),
      completedAt:   null,
    })

    // Initialise streak tracking immediately
    await InitialiseStreakAction(path.id, path.userId)

    return path
  },
)
