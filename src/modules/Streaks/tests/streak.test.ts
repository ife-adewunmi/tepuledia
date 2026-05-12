import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Streak } from '@/modules/Streaks/contracts/models/streak.model'

const mockRepo = {
  create:                    vi.fn(),
  findByPracticePathId:      vi.fn(),
  update:                    vi.fn(),
}

vi.mock('@/modules/Streaks/database/repositories/streak.repository', () => ({
  StreakRepository: vi.fn(() => mockRepo),
}))

vi.mock('@lumiarq/framework', () => ({
  defineAction: (fn: unknown) => fn,
}))

import { UpdateStreakAction } from '@/modules/Streaks/logic/actions/update-streak.action'

// ── Helpers ────────────────────────────────────────────────────────────────────

const makeStreak = (override: Partial<Streak> = {}): Streak => ({
  id:             'streak-1',
  practicePathId: 'path-1',
  userId:         'user-1',
  currentStreak:  0,
  longestStreak:  0,
  lastProofDate:  null,
  updatedAt:      new Date(),
  ...override,
})

const daysAgo = (n: number): Date => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('UpdateStreakAction — streak logic', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('initialises streak to 1 when no record exists', async () => {
    mockRepo.findByPracticePathId.mockResolvedValue(null)
    mockRepo.create.mockImplementation((d) => d)

    await UpdateStreakAction('path-1', 'user-1', new Date())

    expect(mockRepo.create).toHaveBeenCalledOnce()
    const arg = mockRepo.create.mock.calls[0]![0]
    expect(arg.currentStreak).toBe(1)
    expect(arg.longestStreak).toBe(1)
  })

  it('increments streak when last proof was yesterday', async () => {
    const streak = makeStreak({ currentStreak: 3, longestStreak: 5, lastProofDate: daysAgo(1) })
    mockRepo.findByPracticePathId.mockResolvedValue(streak)
    mockRepo.update.mockImplementation((_, d) => ({ ...streak, ...d }))

    await UpdateStreakAction('path-1', 'user-1', new Date())

    expect(mockRepo.update).toHaveBeenCalledOnce()
    const [, data] = mockRepo.update.mock.calls[0]!
    expect(data.currentStreak).toBe(4)
    expect(data.longestStreak).toBe(5) // not exceeded yet
  })

  it('updates longestStreak when current exceeds it', async () => {
    const streak = makeStreak({ currentStreak: 5, longestStreak: 5, lastProofDate: daysAgo(1) })
    mockRepo.findByPracticePathId.mockResolvedValue(streak)
    mockRepo.update.mockImplementation((_, d) => ({ ...streak, ...d }))

    await UpdateStreakAction('path-1', 'user-1', new Date())

    const [, data] = mockRepo.update.mock.calls[0]!
    expect(data.currentStreak).toBe(6)
    expect(data.longestStreak).toBe(6)
  })

  it('resets streak to 1 when last proof was 2+ days ago', async () => {
    const streak = makeStreak({ currentStreak: 10, longestStreak: 10, lastProofDate: daysAgo(3) })
    mockRepo.findByPracticePathId.mockResolvedValue(streak)
    mockRepo.update.mockImplementation((_, d) => ({ ...streak, ...d }))

    await UpdateStreakAction('path-1', 'user-1', new Date())

    const [, data] = mockRepo.update.mock.calls[0]!
    expect(data.currentStreak).toBe(1)
    expect(data.longestStreak).toBe(10) // preserved
  })

  it('is idempotent when proof date is today and streak exists', async () => {
    const today  = new Date()
    const streak = makeStreak({ currentStreak: 3, longestStreak: 5, lastProofDate: today })
    mockRepo.findByPracticePathId.mockResolvedValue(streak)

    const result = await UpdateStreakAction('path-1', 'user-1', today)

    expect(mockRepo.update).not.toHaveBeenCalled()
    expect(result.currentStreak).toBe(3)
  })
})
