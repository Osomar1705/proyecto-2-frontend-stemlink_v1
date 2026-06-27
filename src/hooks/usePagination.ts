import { useSearchParams } from 'react-router-dom'

export function usePagination(defaultSize = 10) {
  const [params, setParams] = useSearchParams()

  const page = parseInt(params.get('page') || '0', 10)
  const size = parseInt(params.get('size') || String(defaultSize), 10)

  const setPage = (p: number) => {
    const next = new URLSearchParams(params)
    next.set('page', String(p))
    setParams(next)
  }

  const setSize = (s: number) => {
    const next = new URLSearchParams(params)
    next.set('size', String(s))
    next.set('page', '0')
    setParams(next)
  }

  return { page, size, setPage, setSize }
}
