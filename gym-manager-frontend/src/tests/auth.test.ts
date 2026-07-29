import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { AxiosError, AxiosHeaders } from 'axios'

// Mock the auth API so store tests don't hit the network.
vi.mock('@/api/auth', () => ({
  authApi: {
    login: vi.fn(),
    validate: vi.fn(),
  },
}))

import { authApi } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import { tokenStorage, toApiError } from '@/api/client'

const mockedLogin = vi.mocked(authApi.login)
const mockedValidate = vi.mocked(authApi.validate)

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    sessionStorage.clear()
    vi.clearAllMocks()
  })

  it('persists the JWT on successful login', async () => {
    mockedLogin.mockResolvedValueOnce({ token: 'jwt-token' })
    const auth = useAuthStore()
    await auth.login({ email: 'a@b.co', password: 'pw' })
    expect(auth.isAuthenticated).toBe(true)
    expect(tokenStorage.get()).toBe('jwt-token')
  })

  it('clears the session on logout', () => {
    tokenStorage.set('jwt-token')
    const auth = useAuthStore()
    auth.logout()
    expect(auth.isAuthenticated).toBe(false)
    expect(tokenStorage.get()).toBeNull()
  })

  it('clears the session when bootstrap validation fails (expired token)', async () => {
    tokenStorage.set('stale-token')
    mockedValidate.mockRejectedValueOnce(new Error('401'))
    const auth = useAuthStore()
    await auth.bootstrap()
    expect(auth.isAuthenticated).toBe(false)
    expect(tokenStorage.get()).toBeNull()
    expect(auth.isBootstrapping).toBe(false)
  })

  it('keeps a valid session through bootstrap', async () => {
    tokenStorage.set('good-token')
    mockedValidate.mockResolvedValueOnce(true)
    const auth = useAuthStore()
    await auth.bootstrap()
    expect(auth.isAuthenticated).toBe(true)
    expect(tokenStorage.get()).toBe('good-token')
  })
})

describe('toApiError', () => {
  it('extracts 401 status', () => {
    const err = new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', undefined, undefined, {
      status: 401,
      data: { message: 'Invalid credentials' },
      statusText: 'Unauthorized',
      headers: {},
      config: { headers: new AxiosHeaders() },
    })
    const result = toApiError(err)
    expect(result.status).toBe(401)
    expect(result.message).toBe('Invalid credentials')
  })

  it('maps backend field errors (Record<string, string>)', () => {
    const err = new AxiosError('Bad Request', 'ERR_BAD_REQUEST', undefined, undefined, {
      status: 400,
      data: { email: 'Email already in use', name: 'Name is required' },
      statusText: 'Bad Request',
      headers: {},
      config: { headers: new AxiosHeaders() },
    })
    const result = toApiError(err)
    expect(result.fieldErrors).toEqual({
      email: 'Email already in use',
      name: 'Name is required',
    })
  })
})
