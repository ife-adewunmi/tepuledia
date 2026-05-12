import { defineAction }       from '@lumiarq/framework'
import { BaseLogoutAction }   from '@lumiarq/framework/auth'
import { SessionRepository }  from '@/modules/Auth/database/repositories/session.repository'

const sessionRepo = new SessionRepository()

export const LogoutAction = defineAction(async (sessionId: string): Promise<void> => {
  await BaseLogoutAction({ sessionId }, { sessionRepo })
})
