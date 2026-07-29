/** Domain & API contract types. These mirror the backend exactly. */

export type MembershipPlan = 'BASIC' | 'PREMIUM' | 'VIP'
export type MembershipStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED'

export const MEMBERSHIP_PLANS: MembershipPlan[] = ['BASIC', 'PREMIUM', 'VIP']
export const MEMBERSHIP_STATUSES: MembershipStatus[] = ['ACTIVE', 'PAUSED', 'CANCELLED']

export interface Member {
  id: string
  name: string
  email: string
  address: string
  dateOfBirth: string
  joinedDate: string
  membershipPlan: MembershipPlan
  membershipStatus: MembershipStatus
}

/** Create payload. Note: membershipStatus is intentionally omitted — the
 *  backend defaults new members to ACTIVE. */
export interface CreateMemberRequest {
  name: string
  email: string
  address: string
  dateOfBirth: string
  joinedDate: string
  membershipPlan: MembershipPlan
}

/** Update payload. joinedDate is immutable and never sent.
 *  membershipStatus is optional; when omitted the backend preserves it. */
export interface UpdateMemberRequest {
  name: string
  email: string
  address: string
  dateOfBirth: string
  membershipPlan: MembershipPlan
  membershipStatus?: MembershipStatus
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

/** Backend field-level validation errors: field name -> message. */
export type FieldErrors = Record<string, string>
