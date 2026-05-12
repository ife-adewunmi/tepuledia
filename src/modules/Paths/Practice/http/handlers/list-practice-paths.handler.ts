import { defineHandler }           from '@lumiarq/framework'
import { ListPracticePathsQuery }  from '@/modules/Paths/Practice/logic/queries/get-practice-paths.query'

export const ListPracticePathsHandler = defineHandler(async (ctx) => {
  const userId = ctx.get('userId') as string
  const limit  = parseInt(ctx.req.query('limit') ?? '20', 10)
  const offset = parseInt(ctx.req.query('offset') ?? '0', 10)

  const paths = await ListPracticePathsQuery(userId, { limit, offset })
  return ctx.json({ data: paths })
})
