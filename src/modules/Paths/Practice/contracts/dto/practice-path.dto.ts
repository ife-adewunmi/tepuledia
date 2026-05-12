import { z } from 'zod'

export const CreatePracticePathSchema = z.object({
  title:         z.string().min(3, 'Title must be at least 3 characters').max(100),
  commitment:    z.string().min(10, 'Commitment must be at least 10 characters').max(300),
  description:   z.string().max(1000).optional(),
  durationDays:  z.number().int().min(1).max(365),
  frequency:     z.number().int().min(1).max(10).default(1),
  proofFormat:   z.enum(['image', 'video', 'voice', 'link', 'text', 'file']),
  proofStandard: z.string().min(5, 'Proof standard must be at least 5 characters').max(300),
  isPublic:      z.boolean().default(true),
})

export const UpdatePracticePathSchema = z.object({
  title:         z.string().min(3).max(100).optional(),
  commitment:    z.string().min(10).max(300).optional(),
  description:   z.string().max(1000).optional(),
  proofStandard: z.string().min(5).max(300).optional(),
  isPublic:      z.boolean().optional(),
})

export type CreatePracticePathDto = z.infer<typeof CreatePracticePathSchema>
export type UpdatePracticePathDto = z.infer<typeof UpdatePracticePathSchema>
