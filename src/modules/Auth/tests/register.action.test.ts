import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Minimal stubs ──────────────────────────────────────────────────────────────

const mockIdentityRepo = {
  findByEmail: vi.fn(),
  create:      vi.fn(),
}

vi.mock('@/modules/Auth/database/repositories/identity.repository', () => ({
  IdentityRepository: vi.fn(() => mockIdentityRepo),
}))

vi.mock('@lumiarq/framework', () => ({
  defineAction: (fn: unknown) => fn,
  EventBus:     { emit: vi.fn() },
}))

vi.mock('@lumiarq/framework/auth', () => ({
  BaseRegisterAction: vi.fn(),
}))

import { BaseRegisterAction } from '@lumiarq/framework/auth'
import { RegisterAction }     from '@/modules/Auth/logic/actions/register.action'

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('RegisterAction', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('calls BaseRegisterAction and returns identity', async () => {
    const fakeIdentity = { id: 'id-1', email: 'alice@example.com', passwordHash: 'hash' }
    vi.mocked(BaseRegisterAction).mockResolvedValue(fakeIdentity as any)

    const result = await RegisterAction({
        email: 'alice@example.com', password: 'password123',
        confirmPassword: ''
    })

    expect(BaseRegisterAction).toHaveBeenCalledWith(
      { email: 'alice@example.com', password: 'password123' },
      { identityRepo: mockIdentityRepo },
    )
    expect(result.id).toBe('id-1')
  })
})
