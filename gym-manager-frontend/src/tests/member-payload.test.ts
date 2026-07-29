import { describe, expect, it } from 'vitest'
import {
  buildCreatePayload,
  buildUpdatePayload,
  emptyFormValues,
  formValuesFromMember,
  validateForm,
  type MemberFormValues,
} from '@/lib/member-payload'
import type { Member } from '@/types/member'

const original: Member = {
  id: 'abc',
  name: 'Jordan Rivera',
  email: 'jordan@example.com',
  address: '120 Market St',
  dateOfBirth: '1992-04-04',
  joinedDate: '2023-01-15',
  membershipPlan: 'BASIC',
  membershipStatus: 'ACTIVE',
}

function values(overrides: Partial<MemberFormValues> = {}): MemberFormValues {
  return { ...formValuesFromMember(original), ...overrides }
}

describe('buildCreatePayload', () => {
  it('omits membershipStatus so the backend applies its ACTIVE default', () => {
    const payload = buildCreatePayload(values())
    expect(payload).not.toHaveProperty('membershipStatus')
  })

  it('includes joinedDate and trims text fields', () => {
    const payload = buildCreatePayload(values({ name: '  Jordan  ', email: ' a@b.co ' }))
    expect(payload.name).toBe('Jordan')
    expect(payload.email).toBe('a@b.co')
    expect(payload.joinedDate).toBe('2023-01-15')
    expect(payload.membershipPlan).toBe('BASIC')
  })
})

describe('buildUpdatePayload', () => {
  it('never sends joinedDate (immutable)', () => {
    const payload = buildUpdatePayload(values(), original)
    expect(payload).not.toHaveProperty('joinedDate')
  })

  it('omits membershipStatus when unchanged (preserves backend value)', () => {
    const payload = buildUpdatePayload(values({ membershipStatus: 'ACTIVE' }), original)
    expect(payload).not.toHaveProperty('membershipStatus')
  })

  it('includes membershipStatus when changed', () => {
    const payload = buildUpdatePayload(values({ membershipStatus: 'PAUSED' }), original)
    expect(payload.membershipStatus).toBe('PAUSED')
  })

  it('carries edited fields through', () => {
    const payload = buildUpdatePayload(values({ name: 'New Name', membershipPlan: 'VIP' }), original)
    expect(payload.name).toBe('New Name')
    expect(payload.membershipPlan).toBe('VIP')
  })
})

describe('validateForm', () => {
  it('requires joinedDate only in create mode', () => {
    const blank = emptyFormValues('')
    blank.name = 'A name'
    blank.email = 'a@b.co'
    blank.address = 'x'
    blank.dateOfBirth = '1990-01-01'
    const createErrors = validateForm(blank, { requireJoinedDate: true })
    expect(createErrors.joinedDate).toBeDefined()
    const editErrors = validateForm(blank, { requireJoinedDate: false })
    expect(editErrors.joinedDate).toBeUndefined()
  })

  it('rejects malformed email', () => {
    const errors = validateForm(values({ email: 'not-an-email' }), { requireJoinedDate: false })
    expect(errors.email).toBeDefined()
  })

  it('passes a fully valid form', () => {
    expect(validateForm(values(), { requireJoinedDate: true })).toEqual({})
  })
})
