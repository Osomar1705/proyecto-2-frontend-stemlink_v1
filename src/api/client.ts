import axios from 'axios'
import type { AuthResponse } from '../types'
import { clearAuth, getStoredToken, storeAuth, updateStoredAuth } from '../utils/authStorage'

const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504])
const RETRY_BACKOFF_MS = 400
const MAX_RETRIES = 2
const REQUEST_TIMEOUT_MS = 25000

type RetryConfig = {
  _retryCount?: number
  _authRefreshed?: boolean
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

const DEFAULT_API_BASE_URL = 'https://stem-link-app-1.onrender.com'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL

const authRefreshClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
})

async function refreshAuthToken() {
  const currentToken = getStoredToken()
  const response = await authRefreshClient.post<AuthResponse>(
    '/api/auth/refresh',
    undefined,
    {
      headers: currentToken ? { Authorization: `Bearer ${currentToken}` } : undefined,
    },
  )

  const refreshed = response.data
  const nextAuth = updateStoredAuth(refreshed)
  if (nextAuth) {
    storeAuth(nextAuth)
    return nextAuth.token
  }

  storeAuth(refreshed)
  return refreshed.token
}

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  paramsSerializer: {
    serialize(params) {
      const search = new URLSearchParams()

      for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === '') continue

        if (Array.isArray(value)) {
          if (value.length) search.set(key, value.join(','))
          continue
        }

        search.set(key, String(value))
      }

      return search.toString()
    },
  },
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

client.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (!axios.isAxiosError(error) || axios.isCancel(error)) {
      return Promise.reject(error)
    }

    const config = error.config as (typeof error.config & RetryConfig) | undefined
    const method = config?.method?.toLowerCase()
    const url = config?.url || ''
    const isNetworkError = !error.response && !config?.signal?.aborted
    const isRetryableMethod = method === 'get'
    const hasRetriesLeft = (config?._retryCount ?? 0) < MAX_RETRIES

    if (config && isNetworkError && isRetryableMethod && hasRetriesLeft) {
      config._retryCount = (config._retryCount ?? 0) + 1
      await wait(RETRY_BACKOFF_MS * 2 ** (config._retryCount - 1))
      return client(config)
    }

    if (error.response?.status === 401 && config && !config._authRefreshed && !url.includes('/api/auth/login') && !url.includes('/api/auth/register') && !url.includes('/api/auth/refresh')) {
      config._authRefreshed = true

      try {
        const freshToken = await refreshAuthToken()
        const headers = axios.AxiosHeaders.from(config.headers)
        headers.set('Authorization', `Bearer ${freshToken}`)
        config.headers = headers
        return client(config)
      } catch {
        clearAuth()
        window.location.href = '/login'
      }
    }

    if (config && error.response?.status && RETRYABLE_STATUS.has(error.response.status) && isRetryableMethod && hasRetriesLeft) {
      config._retryCount = (config._retryCount ?? 0) + 1
      await wait(RETRY_BACKOFF_MS * 2 ** (config._retryCount - 1))
      return client(config)
    }

    return Promise.reject(error)
  }
)

export default client
