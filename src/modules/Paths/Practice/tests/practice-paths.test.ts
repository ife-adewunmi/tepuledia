import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { PracticePath } from '@/modules/Paths/Practice/contracts/models/practice-path.model'

// ── Stubs ──────────────────────────────────────────────────────────────────────

const mockRepo = {
  create:       vi.fn(),
  findById:     vi.fn(),
  findByUserId: vi.fn(),
  update:       vi.fn(),
  updateStatus: vi.fn(),
  findPublic:   vi.fn(),
}

vi.mock('@/modules/PracticePaths/database/repositories/practice-path.repository', () => ({
  PracticePathRepository: vi.fn(() => mockRepo),
}))

vi.mock('@lumiarq/framework', () => ({
  defineAction: (fn: unknown) => fn,
}))

import { CreatePracticePathAction }  from '@/modules/Paths/Practice/logic/actions/create-practice-path.action'
import { UpdatePracticePathAction }  from '@/modules/Paths/Practice/logic/actions/update-practice-path.action'
import { AbandonPracticePathAction } from '@/modules/Paths/Practice/logic/actions/abandon-practice-path.action'

// ── Helpers ────────────────────────────────────────────────────────────────────

const makeActivePath = (override: Partial<PracticePath> = {}): PracticePath => ({
  id:            'path-1',
  userId:        'user-1',
  title:         'Daily pushups',
  commitment:    'I commit to doing 50 pushups every day for 30 days',
  description:   null,
  durationDays:  30,
  frequency:     1,
  proofFormat:   'image',
  proofStandard: 'Photo showing completed reps on a mat',
  status:        'active',
  isPublic:      true,
  startedAt:     new Date(),
  completedAt:   null,
  createdAt:     new Date(),
  updatedAt:     new Date(),
  ...override,
})

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('CreatePracticePathAction', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('creates a practice path with status active', async () => {
    const path = makeActivePath()
    mockRepo.create.mockResolvedValue(path)

    const result = await CreatePracticePathAction({
      userId:        'user-1',
      title:         'Daily pushups',
      commitment:    'I commit to doing 50 pushups every day for 30 days',
      durationDays:  30,
      frequency:     1,
      proofFormat:   'image',
      proofStandard: 'Photo showing completed reps on a mat',
      isPublic:      true,
    })

    expect(mockRepo.create).toHaveBeenCalledOnce()
    const createArg = mockRepo.create.mock.calls[0]![0] as PracticePath
    expect(createArg.status).toBe('active')
    expect(createArg.userId).toBe('user-1')
    expect(result.title).toBe('Daily pushups')
  })
})

describe('UpdatePracticePathAction', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('updates when user is owner', async () => {
    const path    = makeActivePath()
    const updated = makeActivePath({ title: 'Evening pushups' })
    mockRepo.findById.mockResolvedValue(path)
    mockRepo.update.mockResolvedValue(updated)

    const result = await UpdatePracticePathAction('path-1', 'user-1', { title: 'Evening pushups' })
    expect(result.title).toBe('Evening pushups')
  })

  it('throws Forbidden when userId does not match', async () => {
    mockRepo.findById.mockResolvedValue(makeActivePath({ userId: 'owner-user' }))
    await expect(UpdatePracticePathAction('path-1', 'other-user', { title: 'x' }))
      .rejects.toThrow('Forbidden')
  })
})

describe('AbandonPracticePathAction', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('sets status to abandoned', async () => {
    mockRepo.findById.mockResolvedValue(makeActivePath())
    mockRepo.updateStatus.mockResolvedValue(undefined)

    await AbandonPracticePathAction('path-1', 'user-1')
    expect(mockRepo.updateStatus).toHaveBeenCalledWith('path-1', 'abandoned')
  })

  it('throws when path is already abandoned', async () => {
    mockRepo.findById.mockResolvedValue(makeActivePath({ status: 'abandoned' }))
    await expect(AbandonPracticePathAction('path-1', 'user-1'))
      .rejects.toThrow('not active')
  })
})
