import type {
  Member,
  MembershipPlan,
  MembershipStatus,
} from '@/types/member'

export type SortKey = 'name' | 'joinedDate' | 'plan' | 'status'
export type SortDir = 'asc' | 'desc'

export interface MemberFilterState {
  search: string
  plan: MembershipPlan | 'ALL'
  status: MembershipStatus | 'ALL'
  sortKey: SortKey
  sortDir: SortDir
}

export const defaultFilterState = (): MemberFilterState => ({
  search: '',
  plan: 'ALL',
  status: 'ALL',
  sortKey: 'joinedDate',
  sortDir: 'desc',
})

const PLAN_ORDER: Record<MembershipPlan, number> = {
  BASIC: 0,
  PREMIUM: 1,
  VIP: 2,
}
const STATUS_ORDER: Record<MembershipStatus, number> = {
  ACTIVE: 0,
  PAUSED: 1,
  CANCELLED: 2,
}

/** Case-insensitive search across name and email. */
export function searchMembers(members: Member[], query: string): Member[] {
  const q = query.trim().toLowerCase()
  if (!q) return members
  return members.filter(
    (m) =>
      m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q),
  )
}

/** Apply search + plan + status + sort. Pure and deterministic (for tests). */
export function applyFilters(
  members: Member[],
  state: MemberFilterState,
): Member[] {
  let result = searchMembers(members, state.search)

  if (state.plan !== 'ALL') {
    result = result.filter((m) => m.membershipPlan === state.plan)
  }
  if (state.status !== 'ALL') {
    result = result.filter((m) => m.membershipStatus === state.status)
  }

  const dir = state.sortDir === 'asc' ? 1 : -1
  result = [...result].sort((a, b) => {
    let cmp = 0
    switch (state.sortKey) {
      case 'name':
        cmp = a.name.localeCompare(b.name)
        break
      case 'joinedDate':
        cmp = a.joinedDate.localeCompare(b.joinedDate)
        break
      case 'plan':
        cmp = PLAN_ORDER[a.membershipPlan] - PLAN_ORDER[b.membershipPlan]
        break
      case 'status':
        cmp = STATUS_ORDER[a.membershipStatus] - STATUS_ORDER[b.membershipStatus]
        break
    }
    // Stable tiebreaker by name so equal keys never jitter.
    if (cmp === 0) cmp = a.name.localeCompare(b.name)
    return cmp * dir
  })

  return result
}

export interface PageResult<T> {
  items: T[]
  page: number
  pageCount: number
  total: number
  from: number
  to: number
}

/** Client-side pagination. Clamps the page into range. */
export function paginate<T>(items: T[], page: number, pageSize: number): PageResult<T> {
  const total = items.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const clamped = Math.min(Math.max(1, page), pageCount)
  const start = (clamped - 1) * pageSize
  const slice = items.slice(start, start + pageSize)
  return {
    items: slice,
    page: clamped,
    pageCount,
    total,
    from: total === 0 ? 0 : start + 1,
    to: Math.min(start + pageSize, total),
  }
}

export interface DashboardMetrics {
  total: number
  status: Record<MembershipStatus, number>
  plan: Record<MembershipPlan, number>
  recent: Member[]
}

/** Derive all dashboard metrics client-side from the member list. */
export function computeMetrics(members: Member[], recentCount = 5): DashboardMetrics {
  const status: Record<MembershipStatus, number> = {
    ACTIVE: 0,
    PAUSED: 0,
    CANCELLED: 0,
  }
  const plan: Record<MembershipPlan, number> = {
    BASIC: 0,
    PREMIUM: 0,
    VIP: 0,
  }
  for (const m of members) {
    status[m.membershipStatus]++
    plan[m.membershipPlan]++
  }
  const recent = [...members]
    .sort((a, b) => b.joinedDate.localeCompare(a.joinedDate))
    .slice(0, recentCount)

  return { total: members.length, status, plan, recent }
}
