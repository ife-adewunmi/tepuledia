import { defineEvent } from '@lumiarq/framework'
import { z }           from 'zod'

export const ProofSubmitted = defineEvent({
  name: 'proof.submitted',
  schema: z.object({
    proofId:        z.string(),
    userId:         z.string(),
    practicePathId: z.string(),
    isPublic:       z.boolean(),
  }),
})
