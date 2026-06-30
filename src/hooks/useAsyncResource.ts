import { useCallback, useEffect, useState } from 'react'
import type { DependencyList } from 'react'
import { getApiErrorInfo } from '../utils/errors'

interface UseAsyncResourceOptions<T> {
  initialData: T
  load: (signal: AbortSignal) => Promise<T>
  deps: DependencyList
  onError?: (message: string) => void
}

export function useAsyncResource<T>({
  initialData,
  load,
  deps,
  onError,
}: UseAsyncResourceOptions<T>) {
  const [data, setData] = useState<T>(initialData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadToken, setReloadToken] = useState(0)

  const reload = useCallback(() => {
    setReloadToken((value) => value + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    const run = async () => {
      setLoading(true)
      setError('')

      try {
        const result = await load(controller.signal)
        setData(result)
      } catch (error: unknown) {
        const err = error as { name?: string }
        if (err.name !== 'CanceledError') {
          const info = getApiErrorInfo(error)
          setError(info.message)
          onError?.(info.message)
        }
      } finally {
        setLoading(false)
      }
    }

    run()
    return () => controller.abort()
  }, [...deps, load, onError, reloadToken])

  return { data, setData, loading, error, reload }
}
