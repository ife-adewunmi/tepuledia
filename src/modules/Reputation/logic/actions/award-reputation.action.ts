import { defineAction, getConnection } from '@lumiarq/framework'
import { userProfiles }                from '@/modules/User/database/schemas/user.schema'
import { eq, sql }               from 'drizzle-orm'
import { REPUTATION_POINTS }     from '@/modules/Reputation/logic/tasks/calculate-score.task'

interface AwardReputationInput {
  userId: string
  reason: keyof typeof REPUTATION_POINTS
}

export const AwardReputationAction = defineAction(
  async (input: AwardReputationInput): Promise<void> => {
    const points = REPUTATION_POINTS[input.reason]

    const db = getConnection()
    await db
      .update(userProfiles)
      .set({
        reputationScore: sql`${userProfiles.reputationScore} + ${points}`,
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.id, input.userId))
  },
)
