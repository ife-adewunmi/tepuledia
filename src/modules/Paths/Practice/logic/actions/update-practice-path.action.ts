import { defineAction }           from '@lumiarq/framework'
import { PracticePathRepository } from '@/modules/Paths/Practice/database/repositories/practice-path.repository'
import type { UpdatePracticePathDto } from '@/modules/Paths/Practice/contracts/dto/practice-path.dto'
import type { PracticePath }          from '@/modules/Paths/Practice/contracts/models/practice-path.model'

const repo = new PracticePathRepository()

export const UpdatePracticePathAction = defineAction(
  async (id: string, userId: string, dto: UpdatePracticePathDto): Promise<PracticePath> => {
    const existing = await repo.findById(id)
    if (!existing) throw new Error('Practice path not found')
    if (existing.userId !== userId) throw new Error('Forbidden')

    return repo.update(id, dto)
  },
)
