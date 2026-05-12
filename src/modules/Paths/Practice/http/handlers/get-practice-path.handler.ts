import { defineHandler }          from '@lumiarq/framework'
import { GetPracticePathQuery }   from '@/modules/Paths/Practice/logic/queries/get-practice-paths.query'

export const GetPracticePathHandler = defineHandler(async (ctx) => {
  const id      = ctx.req.param('id')
  const userId  = ctx.get('userId') as string | undefined
  const path    = await GetPracticePathQuery(id)

  if (!path) {
    return ctx.json({ message: 'Practice path not found' }, 404)
  }

  // Non-public paths only visible to owner
  if (!path.isPublic && path.userId !== userId) {
    return ctx.json({ message: 'Not found' }, 404)
  }

  return ctx.json({ data: path })
})
