import { BaseRegisterValidator } from '@lumiarq/framework/auth'
export type { BaseRegisterData as RegisterData } from '@lumiarq/framework/auth'

/** Register validator — extend here to add app-specific rules. */
export const RegisterValidator = BaseRegisterValidator
