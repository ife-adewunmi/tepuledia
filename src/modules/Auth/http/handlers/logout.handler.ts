import { defineHandler } from '@lumiarq/framework'
import { LogoutAction }  from '@/modules/Auth/logic/actions/logout.action'

export const LogoutHandler = defineHandler(async (ctx) => {
  const sessionId = ctx.get('sessionId') as string | undefined
  if (sessionId) {
    await LogoutAction(sessionId)
  }
  return ctx.json({ message: 'Logged out' }, 200)
})
