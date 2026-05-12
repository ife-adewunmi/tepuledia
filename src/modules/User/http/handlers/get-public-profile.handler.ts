import { defineHandler }        from '@lumiarq/framework'
import { GetPublicProfileQuery } from '@/modules/User/logic/queries/get-profile.query'

export const GetPublicProfileHandler = defineHandler(async (ctx) => {
  const username = ctx.req.param('username')
  const profile  = await GetPublicProfileQuery(username)

  if (!profile) {
    return ctx.json({ message: 'Profile not found' }, 404)
  }

  // Omit sensitive fields
  return ctx.json({
    data: {
      id:             profile.id,
      username:       profile.username,
      displayName:    profile.displayName,
      bio:            profile.bio,
      avatarUrl:      profile.avatarUrl,
      reputationScore: profile.reputationScore,
      joinedAt:       profile.createdAt,
    },
  })
})
