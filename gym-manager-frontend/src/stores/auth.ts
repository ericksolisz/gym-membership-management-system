import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { authApi } from '@/api/auth'
import { tokenStorage, toApiError } from '@/api/client'
import type { LoginRequest } from '@/types/member'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(tokenStorage.get())
  const isBootstrapping = ref(true)
  const isAuthenticated = computed(() => token.value !== null)

  /** Validate the persisted token during app bootstrap. */
  async function bootstrap(): Promise<void> {
    isBootstrapping.value = true
    const existing = tokenStorage.get()
    if (!existing) {
      token.value = null
      isBootstrapping.value = false
      return
    }
    token.value = existing
    try {
      await authApi.validate()
    } catch {
      // Invalid/expired — the interceptor already cleared storage on 401.
      clearSession()
    } finally {
      isBootstrapping.value = false
    }
  }

  /** Log in and persist the token. Throws an ApiError on failure. */
  async function login(payload: LoginRequest): Promise<void> {
    try {
      const { token: jwt } = await authApi.login(payload)
      tokenStorage.set(jwt)
      token.value = jwt
    } catch (err) {
      throw toApiError(err)
    }
  }

  /** Client-side logout: clear the session. */
  function logout(): void {
    clearSession()
  }

  function clearSession(): void {
    tokenStorage.clear()
    token.value = null
  }

  return {
    token,
    isBootstrapping,
    isAuthenticated,
    bootstrap,
    login,
    logout,
    clearSession,
  }
})
