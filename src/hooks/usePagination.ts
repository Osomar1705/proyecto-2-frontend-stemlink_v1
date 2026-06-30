import { useSearchParams } from 'react-router-dom'

const PAGE_SIZES = [10, 25, 50] as const

function parsePage(value: string | null): number {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : 0
}

function parseSize(value: string | null, defaultSize: number): number {
  const parsed = Number(value)
  if (PAGE_SIZES.includes(parsed as (typeof PAGE_SIZES)[number])) return parsed
  return PAGE_SIZES.includes(defaultSize as (typeof PAGE_SIZES)[number]) ? defaultSize : PAGE_SIZES[0]
}

export function usePagination(defaultSize = 10) {
  const [params, setParams] = useSearchParams()

  const page = parsePage(params.get('page'))
  const size = parseSize(params.get('size'), defaultSize)

  const setPage = (p: number) => {
    const next = new URLSearchParams(params)
    next.set('page', String(Math.max(0, Math.trunc(p))))
    setParams(next)
  }

  const setSize = (s: number) => {
    const next = new URLSearchParams(params)
    next.set('size', String(parseSize(String(s), defaultSize)))
    next.set('page', '0')
    setParams(next)
  }

  return { page, size, setPage, setSize }
}
