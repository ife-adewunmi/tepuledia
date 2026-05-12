// Assembles all schemas in FK dependency order.
// Auth schemas are owned by their modules and re-exported here for migrations.
export * from './audit-log.schema'

// After pnpm lumis auth:install these are auto-added:
export * from '@/modules/Auth/database/schemas/identity.schema'
export * from '@/modules/Auth/database/schemas/session.schema'
export * from '@/modules/Auth/database/schemas/role.schema'
export * from '@/modules/Auth/database/schemas/identity-role.schema'
export * from '@/modules/Auth/database/schemas/password-reset.schema'
export * from '@/modules/User/database/schemas/user.schema'

// Tepuledia domain schemas
export * from '@/modules/Paths/Practice/database/schemas/practice-path.schema'
export * from '@/modules/Proofs/database/schemas/proof.schema'
export * from '@/modules/Streaks/database/schemas/streak.schema'
