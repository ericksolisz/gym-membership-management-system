import { describe, expect, it } from 'vitest'
import {
  applyFilters,
  computeMetrics,
  defaultFilterState,
  paginate,
  searchMembers,
} from '@/lib/member-filters'
import type { Member } from '@/types/member'

function member(partial: Partial<Member> & { id: string }): Member {
  return {
    id: partial.id,
    name: partial.name ?? 'Test User',
    email: partial.email ?? 'test@example.com',
    address: partial.address ?? '1 Main St',
    dateOfBirth: partial.dateOfBirth ?? '1990-01-01',
    joinedDate: partial.joinedDate ?? '2024-01-01',
    membershipPlan: partial.membershipPlan ?? 'BASIC',
    membershipStatus: partial.membershipStatus ?? 'ACTIVE',
  }
}

const members: Member[] = [
  member({ id: '1', name: 'Alice Anderson', email: 'alice@gym.com', membershipPlan: 'VIP', membershipStatus: 'ACTIVE', joinedDate: '2024-03-10' }),
  member({ id: '2', name: 'Bob Brown', email: 'bob@work.com', membershipPlan: 'BASIC', membershipStatus: 'PAUSED', joinedDate: '2023-11-01' }),
  member({ id: '3', name: 'Carol Clark', email: 'carol@gym.com', membershipPlan: 'PREMIUM', membershipStatus: 'CANCELLED', joinedDate: '2024-06-20' }),
  member({ id: '4', name: 'Dave Davis', email: 'dave@gym.com', membershipPlan: 'PREMIUM', membershipStatus: 'ACTIVE', joinedDate: '2024-01-05' }),
]

describe('searchMembers', () => {
  it('matches name case-insensitively', () => {
    expect(searchMembers(members, 'alice').map((m) => m.id)).toEqual(['1'])
  })
  it('matches email', () => {
    expect(searchMembers(members, 'work.com').map((m) => m.id)).toEqual(['2'])
  })
  it('returns all for empty query', () => {
    expect(searchMembers(members, '   ')).toHaveLength(4)
  })
})

describe('applyFilters', () => {
  it('filters by plan and status together', () => {
    const state = { ...defaultFilterState(), plan: 'PREMIUM' as const, status: 'ACTIVE' as const }
    expect(applyFilters(members, state).map((m) => m.id)).toEqual(['4'])
  })

  it('sorts by name ascending', () => {
    const state = { ...defaultFilterState(), sortKey: 'name' as const, sortDir: 'asc' as const }
    expect(applyFilters(members, state).map((m) => m.name)[0]).toBe('Alice Anderson')
  })

  it('sorts by joinedDate descending', () => {
    const state = { ...defaultFilterState(), sortKey: 'joinedDate' as const, sortDir: 'desc' as const }
    expect(applyFilters(members, state).map((m) => m.id)).toEqual(['3', '1', '4', '2'])
  })

  it('combines search with sort', () => {
    const state = { ...defaultFilterState(), search: 'gym.com', sortKey: 'name' as const, sortDir: 'asc' as const }
    expect(applyFilters(members, state).map((m) => m.id)).toEqual(['1', '3', '4'])
  })
})

describe('paginate', () => {
  it('slices and reports ranges', () => {
    const r = paginate([1, 2, 3, 4, 5], 1, 2)
    expect(r.items).toEqual([1, 2])
    expect(r.pageCount).toBe(3)
    expect(r.from).toBe(1)
    expect(r.to).toBe(2)
  })
  it('clamps out-of-range pages', () => {
    const r = paginate([1, 2, 3], 99, 2)
    expect(r.page).toBe(2)
    expect(r.items).toEqual([3])
  })
  it('handles empty input', () => {
    const r = paginate([], 1, 10)
    expect(r.total).toBe(0)
    expect(r.from).toBe(0)
    expect(r.pageCount).toBe(1)
  })
})

describe('computeMetrics', () => {
  it('derives counts and recent list client-side', () => {
    const m = computeMetrics(members, 2)
    expect(m.total).toBe(4)
    expect(m.status).toEqual({ ACTIVE: 2, PAUSED: 1, CANCELLED: 1 })
    expect(m.plan).toEqual({ BASIC: 1, PREMIUM: 2, VIP: 1 })
    // Recent = latest joinedDate first.
    expect(m.recent.map((x) => x.id)).toEqual(['3', '1'])
  })
})
