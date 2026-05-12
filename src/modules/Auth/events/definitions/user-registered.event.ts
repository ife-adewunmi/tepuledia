import { defineEvent } from '@lumiarq/framework'
import { z } from 'zod'

export const UserRegistered = defineEvent({
  name:   'auth.user.registered',
  schema: z.object({
    identityId: z.string(),
    email:      z.string().email(),
  }),
})
