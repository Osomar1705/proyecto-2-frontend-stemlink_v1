import axios from 'axios'

const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504])
const RETRY_BACKOFF_MS = 400

type RetryConfig = {
  _retryCount?: number
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
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
  const token = sessionStorage.getItem('token')
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
    const isNetworkError = !error.response && !config?.signal?.aborted
    const isRetryableMethod = method === 'get'
    const hasRetriesLeft = (config?._retryCount ?? 0) < 1

    if (config && isNetworkError && isRetryableMethod && hasRetriesLeft) {
      config._retryCount = (config._retryCount ?? 0) + 1
      await wait(RETRY_BACKOFF_MS * 2 ** (config._retryCount - 1))
      return client(config)
    }

    if (error.response?.status === 401) {
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
      window.location.href = '/login'
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
