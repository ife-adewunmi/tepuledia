import type { AuthConfig } from '@lumiarq/framework'

export default {
  guard: 'jwt',
  passwordHashRounds: 12,
  jwt: {
    algorithm: 'RS256',
    expiresIn: '15m',
    refreshExpiresIn: '7d',
  },
  session: {
    name: 'sid',
    expiresIn: '7d',
  },
  sessionTtlMs: 7 * 24 * 60 * 60 * 1000,
  verification: {
    required: true,
    tokenTtl: '24h',
  },
  passwordReset: {
    tokenTtl: '1h',
  },
  features: {
    emailVerification: true,
    passwordConfirmation: false,
  },
} satisfies AuthConfig
