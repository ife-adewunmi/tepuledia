import { PracticePathRepository } from '@/modules/Paths/Practice/database/repositories/practice-path.repository'
import type { PracticePath }       from '@/modules/Paths/Practice/contracts/models/practice-path.model'

const repo = new PracticePathRepository()

export async function GetPracticePathQuery(id: string): Promise<PracticePath | null> {
  return repo.findById(id)
}

export async function ListPracticePathsQuery(
  userId: string,
  opts?: { limit?: number; offset?: number },
): Promise<PracticePath[]> {
  return repo.findByUserId(userId, opts)
}

export async function ListPublicPracticePathsQuery(
  opts?: { limit?: number; offset?: number },
): Promise<PracticePath[]> {
  return repo.findPublic(opts)
}
