import { api } from './client'
import type {
  CreateMemberRequest,
  Member,
  UpdateMemberRequest,
} from '@/types/member'

export const membersApi = {
  /** GET /api/members — the backend has no by-ID / search endpoints, so the
   *  full list is the single source of truth. */
  async list(): Promise<Member[]> {
    const { data } = await api.get<Member[]>('/api/members')
    return data
  },

  /** POST /api/members — creates a member (server defaults status to ACTIVE). */
  async create(payload: CreateMemberRequest): Promise<Member> {
    const { data } = await api.post<Member>('/api/members', payload)
    return data
  },

  /** PUT /api/members/{id} — updates and returns the member. */
  async update(id: string, payload: UpdateMemberRequest): Promise<Member> {
    const { data } = await api.put<Member>(`/api/members/${id}`, payload)
    return data
  },

  /** DELETE /api/members/{id} — returns 204 on success. */
  async remove(id: string): Promise<void> {
    await api.delete(`/api/members/${id}`)
  },
}
