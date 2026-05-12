import { z } from 'zod'

export const ResetPasswordValidator = z.object({
  token:                z.string().min(1),
  password:             z.string().min(8, 'Password must be at least 8 characters'),
  passwordConfirmation: z.string().min(8),
}).refine((d) => d.password === d.passwordConfirmation, {
  message: 'Passwords do not match',
  path:    ['passwordConfirmation'],
})

export type ResetPasswordData = z.infer<typeof ResetPasswordValidator>
