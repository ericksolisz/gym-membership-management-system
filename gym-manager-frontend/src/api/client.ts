import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'

export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4004'

const TOKEN_KEY = 'gym.auth.token'

/** Session token storage — sessionStorage per the security requirements. */
export const tokenStorage = {
  get(): string | null {
    return sessionStorage.getItem(TOKEN_KEY)
  },
  set(token: string): void {
    sessionStorage.setItem(TOKEN_KEY, token)
  },
  clear(): void {
    sessionStorage.removeItem(TOKEN_KEY)
  },
}

/**
 * Callback invoked whenever the API returns 401 (expired/invalid session).
 * The auth store registers a handler during bootstrap so it can clear the
 * session and redirect to /login while preserving the intended destination.
 */
let unauthorizedHandler: (() => void) | null = null
export function onUnauthorized(handler: () => void): void {
  unauthorizedHandler = handler
}

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Attach the Bearer token to every outgoing request.
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

// Handle expired/invalid sessions centrally.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status
    const url = error.config?.url ?? ''
    // The login call legitimately returns 401 for bad credentials; let the
    // caller handle that inline rather than triggering a global redirect.
    const isLoginCall = url.includes('/auth/login')
    if (status === 401 && !isLoginCall) {
      tokenStorage.clear()
      unauthorizedHandler?.()
    }
    return Promise.reject(error)
  },
)

/** Normalized error shape used by the UI. */
export interface ApiError {
  status: number | null
  message: string
  fieldErrors: Record<string, string>
}

/** Turn an unknown thrown value into a predictable ApiError. */
export function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? null
    const data = error.response?.data as unknown

    // Backend field errors arrive as Record<string, string>.
    let fieldErrors: Record<string, string> = {}
    let message = error.message

    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>
      if (typeof obj.message === 'string') {
        message = obj.message
      }
      // Prefer an explicit `errors`/`fieldErrors` object, else treat any
      // string-valued map as field errors.
      const candidate =
        (obj.errors as Record<string, unknown>) ||
        (obj.fieldErrors as Record<string, unknown>) ||
        obj
      if (candidate && typeof candidate === 'object') {
        for (const [key, val] of Object.entries(candidate)) {
          if (typeof val === 'string' && key !== 'message') {
            fieldErrors[key] = val
          }
        }
      }
    } else if (typeof data === 'string' && data.trim()) {
      message = data
    }

    if (status === 0 || error.code === 'ERR_NETWORK') {
      message = 'Unable to reach the server. Check your connection and try again.'
    }

    return { status, message, fieldErrors }
  }

  return {
    status: null,
    message: error instanceof Error ? error.message : 'An unexpected error occurred.',
    fieldErrors: {},
  }
}
