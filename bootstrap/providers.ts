import { app } from '@lumiarq/framework'

import type {
  MailerContract,
  QueueContract,
  StorageContract,
  CacheContract,
  AuditContract,
  LoggerContract,
} from '@lumiarq/framework/contracts'

import {
  StubMailer,
  StubQueue,
  StubStorage,
  StubCache,
  StubAudit,
  RequestLogger,
} from '@lumiarq/framework/runtime'

import loggingConfig from '@/config/logging'
import storageConfig from '@/config/storage'

export const logger: LoggerContract = new RequestLogger({
  level: loggingConfig.level,
  prettify: loggingConfig.prettify,
})

// v1 — stub implementations for local dev.
// Replace with real providers before production deployment.

export const mailer: MailerContract = new StubMailer({ logger })

export const queue: QueueContract = new StubQueue({ logger })

export const storage: StorageContract = new StubStorage({
  root: storageConfig.disks.local.root,
  logger,
})

export const cache: CacheContract = new StubCache()

export const audit: AuditContract = new StubAudit({
  verbose: app().isLocal(),
})
