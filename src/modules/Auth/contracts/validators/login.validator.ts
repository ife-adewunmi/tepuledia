import { BaseLoginValidator } from '@lumiarq/framework/auth'
export type { BaseLoginData as LoginData } from '@lumiarq/framework/auth'

/** Login validator — extend here to add app-specific rules. */
export const LoginValidator = BaseLoginValidator
