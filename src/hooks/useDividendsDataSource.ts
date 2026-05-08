import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchPastDividends, fetchUpcomingDividends } from '../api/dividendsApi'
import type {
  DividendRecord,
  DividendsLastRun,
  PastCursor,
  UpcomingCursor,
} from '../types'

interface Options {
  reloadKey: number
  onLastRun?: (lastRun: DividendsLastRun | null) => void
}

interface DividendsDataState {
  rows: DividendRecord[]
  upcomingCount: number
  pastCount: number
  loadingPast: boolean
  loadingUpcoming: boolean
  hasMorePast: boolean
  hasMoreUpcoming: boolean
  initialLoaded: boolean
  loadMorePast: () => Promise<number>
  loadMoreUpcoming: () => Promise<void>
}

function rowKey(r: DividendRecord): string {
  return r._id ?? `${r.symbol}|${r.exDate}`
}

export function useDividendsData(opts: Options): DividendsDataState {
  const { reloadKey, onLastRun } = opts
  const [rows, setRows] = useState<DividendRecord[]>([])
  const [upcomingCount, setUpcomingCount] = useState(0)
  const [pastCount, setPastCount] = useState(0)
  const [hasMorePast, setHasMorePast] = useState(true)
  const [hasMoreUpcoming, setHasMoreUpcoming] = useState(true)
  const [loadingPast, setLoadingPast] = useState(false)
  const [loadingUpcoming, setLoadingUpcoming] = useState(false)
  const [initialLoaded, setInitialLoaded] = useState(false)

  const pastCursorRef = useRef<PastCursor | null>(null)
  const upcomingCursorRef = useRef<UpcomingCursor | null>(null)
  const seenIdsRef = useRef<Set<string>>(new Set())
  const loadingPastRef = useRef(false)
  const loadingUpcomingRef = useRef(false)

  const loadMorePast = useCallback(async (): Promise<number> => {
    if (loadingPastRef.current || !hasMorePast) return 0
    loadingPastRef.current = true
    setLoadingPast(true)
    try {
      const result = await fetchPastDividends(pastCursorRef.current)
      const fresh = result.rows.filter((r) => !seenIdsRef.current.has(rowKey(r)))
      fresh.forEach((r) => seenIdsRef.current.add(rowKey(r)))
      if (fresh.length > 0) {
        setRows((prev) => [...fresh, ...prev])
        setPastCount((c) => c + fresh.length)
      }
      pastCursorRef.current = result.nextCursor
      setHasMorePast(result.hasMore)
      return fresh.length
    } finally {
      loadingPastRef.current = false
      setLoadingPast(false)
    }
  }, [hasMorePast])

  const loadMoreUpcoming = useCallback(async (): Promise<void> => {
    if (loadingUpcomingRef.current || !hasMoreUpcoming) return
    loadingUpcomingRef.current = true
    setLoadingUpcoming(true)
    try {
      const result = await fetchUpcomingDividends(upcomingCursorRef.current)
      const fresh = result.rows.filter((r) => !seenIdsRef.current.has(rowKey(r)))
      fresh.forEach((r) => seenIdsRef.current.add(rowKey(r)))
      if (fresh.length > 0) {
        setRows((prev) => [...prev, ...fresh])
        setUpcomingCount((c) => c + fresh.length)
      }
      upcomingCursorRef.current = result.nextCursor
      setHasMoreUpcoming(result.hasMore)
      if (result.lastRun !== undefined) onLastRun?.(result.lastRun ?? null)
    } finally {
      loadingUpcomingRef.current = false
      setLoadingUpcoming(false)
    }
  }, [hasMoreUpcoming, onLastRun])

  useEffect(() => {
    setRows([])
    setUpcomingCount(0)
    setPastCount(0)
    setHasMorePast(true)
    setHasMoreUpcoming(true)
    setInitialLoaded(false)
    pastCursorRef.current = null
    upcomingCursorRef.current = null
    seenIdsRef.current = new Set()
    loadingPastRef.current = true
    loadingUpcomingRef.current = false
    setLoadingPast(true)
    setLoadingUpcoming(true)

    let cancelled = false

    fetchUpcomingDividends(null)
      .then((upcoming) => {
        if (cancelled) return
        const seen = seenIdsRef.current
        const upcomingRows = upcoming.rows.filter((r) => {
          const k = rowKey(r)
          if (seen.has(k)) return false
          seen.add(k)
          return true
        })
        setRows(upcomingRows)
        setUpcomingCount(upcomingRows.length)
        upcomingCursorRef.current = upcoming.nextCursor
        setHasMoreUpcoming(upcoming.hasMore)
        if (upcoming.lastRun !== undefined) onLastRun?.(upcoming.lastRun ?? null)
      })
      .finally(() => {
        if (cancelled) return
        loadingUpcomingRef.current = false
        setLoadingUpcoming(false)
        setInitialLoaded(true)
        loadingPastRef.current = false
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey])

  return {
    rows,
    upcomingCount,
    pastCount,
    loadingPast,
    loadingUpcoming,
    hasMorePast,
    hasMoreUpcoming,
    initialLoaded,
    loadMorePast,
    loadMoreUpcoming,
  }
}
