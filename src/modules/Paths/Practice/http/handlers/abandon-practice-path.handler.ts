import { defineHandler }               from '@lumiarq/framework'
import { AbandonPracticePathAction }   from '@/modules/Paths/Practice/logic/actions/abandon-practice-path.action'

export const AbandonPracticePathHandler = defineHandler(async (ctx) => {
  const id     = ctx.req.param('id')
  const userId = ctx.get('userId') as string

  try {
    await AbandonPracticePathAction(id, userId)
    return ctx.json({ message: 'Practice path abandoned' })
  } catch (err) {
    if (err instanceof Error && err.message === 'Forbidden') {
      return ctx.json({ message: 'Forbidden' }, 403)
    }
    if (err instanceof Error && err.message === 'Practice path not found') {
      return ctx.json({ message: 'Not found' }, 404)
    }
    throw err
  }
})
