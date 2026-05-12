import { defineHandler }  from '@lumiarq/framework'
import { GetFeedQuery }   from '@/modules/Feed/logic/queries/get-feed.query'

export const GetFeedHandler = defineHandler(async (ctx) => {
  const limitParam = ctx.req.query('limit')
  const cursor     = ctx.req.query('cursor') ?? undefined
  const limit      = limitParam ? parseInt(limitParam, 10) : 20

  const result = await GetFeedQuery({ limit, cursor })

  return ctx.json(result)
})
