/**
 * Environment validation — Zod schema.
 * Access process.env only in this file. All other files import from here.
 */

import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production', 'local', 'staging']).default('development'),

  APP_ENV:  z.enum(['local', 'testing', 'staging', 'production']).default('local'),
  APP_NAME: z.string().min(1).default('Tepuledia'),
  APP_URL:  z.string().url(),

  DB_CONNECTION: z.enum(['sqlite', 'postgres']).default('sqlite'),
  DATABASE_URL:  z.string().min(1),

  // Postgres (optional — only when DB_CONNECTION = 'postgres')
  DB_HOST:     z.string().optional(),
  DB_PORT:     z.coerce.number().optional(),
  DB_DATABASE: z.string().optional(),
  DB_USERNAME: z.string().optional(),
  DB_PASSWORD: z.string().optional(),

  JWT_PRIVATE_KEY: z.string().min(1),
  JWT_PUBLIC_KEY:  z.string().min(1),
  SESSION_SECRET:  z.string().min(64),

  MAIL_DRIVER:       z.string().default('stub'),
  MAIL_FROM_ADDRESS: z.string().email().optional(),
  MAIL_FROM_NAME:    z.string().optional(),

  QUEUE_DRIVER:   z.string().default('stub'),
  STORAGE_DRIVER: z.string().default('local'),
  SESSION_DRIVER: z.string().default('database'),
  CACHE_DRIVER:   z.string().default('memory'),
})

const parsed = schema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Invalid environment variables:')
  for (const [field, issues] of Object.entries(parsed.error.flatten().fieldErrors)) {
    console.error(`  ${field}: ${issues?.join(', ')}`)
  }
  process.exit(1)
}

export const env = parsed.data
