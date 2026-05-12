import { defineAction }    from '@lumiarq/framework'
import { StreakRepository } from '@/modules/Streaks/database/repositories/streak.repository'
import type { Streak }     from '@/modules/Streaks/contracts/models/streak.model'

const repo = new StreakRepository()

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate()
  )
}

function isYesterday(date: Date, today: Date): boolean {
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  return isSameDay(date, yesterday)
}

/** Called after a proof is successfully submitted. */
export const UpdateStreakAction = defineAction(
  async (practicePathId: string, userId: string, proofDate: Date): Promise<Streak> => {
    let streak = await repo.findByPracticePathId(practicePathId)

    // Initialise streak record if it doesn't exist yet
    if (!streak) {
      return repo.create({
        id:             crypto.randomUUID(),
        practicePathId,
        userId,
        currentStreak:  1,
        longestStreak:  1,
        lastProofDate:  proofDate,
      })
    }

    const today = proofDate

    // Same day proof — idempotent, no change
    if (streak.lastProofDate && isSameDay(streak.lastProofDate, today)) {
      return streak
    }

    let newCurrent: number

    if (streak.lastProofDate && isYesterday(streak.lastProofDate, today)) {
      // Consecutive day — increment
      newCurrent = streak.currentStreak + 1
    } else {
      // Missed at least one day — reset
      newCurrent = 1
    }

    const newLongest = Math.max(streak.longestStreak, newCurrent)

    return repo.update(practicePathId, {
      currentStreak: newCurrent,
      longestStreak: newLongest,
      lastProofDate: proofDate,
    })
  },
)

/** Initialise a streak record when a PracticePath is created. */
export const InitialiseStreakAction = defineAction(
  async (practicePathId: string, userId: string): Promise<Streak> => {
    return repo.create({
      id:             crypto.randomUUID(),
      practicePathId,
      userId,
      currentStreak:  0,
      longestStreak:  0,
      lastProofDate:  null,
    })
  },
)
