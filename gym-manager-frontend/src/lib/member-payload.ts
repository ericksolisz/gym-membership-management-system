import type {
  CreateMemberRequest,
  Member,
  MembershipPlan,
  MembershipStatus,
  UpdateMemberRequest,
} from '@/types/member'

/** The mutable shape backing the member form. */
export interface MemberFormValues {
  name: string
  email: string
  address: string
  dateOfBirth: string
  joinedDate: string
  membershipPlan: MembershipPlan
  membershipStatus: MembershipStatus
}

export function emptyFormValues(joinedDate: string): MemberFormValues {
  return {
    name: '',
    email: '',
    address: '',
    dateOfBirth: '',
    joinedDate,
    membershipPlan: 'BASIC',
    membershipStatus: 'ACTIVE',
  }
}

export function formValuesFromMember(member: Member): MemberFormValues {
  return {
    name: member.name,
    email: member.email,
    address: member.address,
    dateOfBirth: member.dateOfBirth,
    joinedDate: member.joinedDate,
    membershipPlan: member.membershipPlan,
    membershipStatus: member.membershipStatus,
  }
}

/**
 * Build the create payload. membershipStatus is deliberately omitted so the
 * backend applies its ACTIVE default.
 */
export function buildCreatePayload(values: MemberFormValues): CreateMemberRequest {
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    address: values.address.trim(),
    dateOfBirth: values.dateOfBirth,
    joinedDate: values.joinedDate,
    membershipPlan: values.membershipPlan,
  }
}

/**
 * Build the update payload. joinedDate is immutable and never sent.
 * When the status is unchanged from the original member we omit
 * membershipStatus so the backend preserves the existing value.
 */
export function buildUpdatePayload(
  values: MemberFormValues,
  original: Member,
): UpdateMemberRequest {
  const payload: UpdateMemberRequest = {
    name: values.name.trim(),
    email: values.email.trim(),
    address: values.address.trim(),
    dateOfBirth: values.dateOfBirth,
    membershipPlan: values.membershipPlan,
  }
  if (values.membershipStatus !== original.membershipStatus) {
    payload.membershipStatus = values.membershipStatus
  }
  return payload
}

/** Client-side form validation. Returns field -> message. */
export function validateForm(
  values: MemberFormValues,
  opts: { requireJoinedDate: boolean },
): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!values.name.trim()) errors.name = 'Name is required.'
  else if (values.name.trim().length < 2) errors.name = 'Name is too short.'

  if (!values.email.trim()) errors.email = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = 'Enter a valid email address.'

  if (!values.address.trim()) errors.address = 'Address is required.'

  if (!values.dateOfBirth) errors.dateOfBirth = 'Date of birth is required.'

  if (opts.requireJoinedDate && !values.joinedDate)
    errors.joinedDate = 'Joined date is required.'

  return errors
}

export type { MembershipStatus }
