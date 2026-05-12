import { defineAction }           from '@lumiarq/framework'
import { PracticePathRepository } from '@/modules/Paths/Practice/database/repositories/practice-path.repository'

const repo = new PracticePathRepository()

export const AbandonPracticePathAction = defineAction(
  async (id: string, userId: string): Promise<void> => {
    const existing = await repo.findById(id)
    if (!existing) throw new Error('Practice path not found')
    if (existing.userId !== userId) throw new Error('Forbidden')
    if (existing.status !== 'active') throw new Error('Practice path is not active')

    await repo.updateStatus(id, 'abandoned')
  },
)
