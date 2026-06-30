import { useCallback, useEffect, useRef, useState } from 'react'
import { getApiErrorInfo } from '../utils/errors'

interface UseAsyncResourceOptions<T> {
  initialData: T
  load: (signal: AbortSignal) => Promise<T>
  onError?: (message: string) => void
}

export function useAsyncResource<T>({
  initialData,
  load,
  onError,
}: UseAsyncResourceOptions<T>) {
  const [data, setData] = useState<T>(initialData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadToken, setReloadToken] = useState(0)
  const onErrorRef = useRef(onError)
  onErrorRef.current = onError

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
        if (!controller.signal.aborted) setData(result)
      } catch (error: unknown) {
        const err = error as { name?: string }
        if (err.name !== 'CanceledError') {
          const info = getApiErrorInfo(error)
          setError(info.message)
          onErrorRef.current?.(info.message)
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    run()
    return () => controller.abort()
  }, [load, reloadToken])

  return { data, setData, loading, error, reload }
}
