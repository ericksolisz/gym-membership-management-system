import { api } from './client'
import type { LoginRequest, LoginResponse } from '@/types/member'

export const authApi = {
  /** POST /auth/login — returns a JWT on success, 401 on bad credentials. */
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/login', payload)
    return data
  },

  /** GET /auth/validate — 200 when the token is valid, 401 otherwise. */
  async validate(): Promise<boolean> {
    await api.get('/auth/validate')
    return true
  },
}
