import { z } from 'zod'

export const SubmitProofSchema = z.object({
  practicePathId: z.string().uuid('Invalid practice path ID'),
  dayNumber:      z.number().int().min(1),
  content:        z.string().max(1000).optional(),
  mediaUrl:       z.string().url().optional(),
  mediaType:      z.enum(['image', 'video', 'voice', 'file']).optional(),
  caption:        z.string().max(300).optional(),
  isPublic:       z.boolean().default(true),
}).refine(
  (data) => data.content || data.mediaUrl,
  { message: 'Either content or mediaUrl is required', path: ['content'] },
)

export type SubmitProofDto = z.infer<typeof SubmitProofSchema>
