import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import type { BodyScrollEvent, GridApi, GridReadyEvent } from 'ag-grid-community'
import { themeAlpine } from 'ag-grid-community'
import { buildDynamicColumnDefs, isSkeletonRow, makeSkeletonRows } from './dividendColumnDefs'
import type { SkeletonRow } from './dividendColumnDefs'
import { useDividendsData } from '../../hooks/useDividendsDataSource'
import type { DividendRecord, DividendsLastRun } from '../../types'

const ROW_HEIGHT = 32
const TOP_TRIGGER_PX = 4
const BOTTOM_TRIGGER_PX = 200
const PAST_PAGE_SIZE = 10

const darkTheme = themeAlpine.withParams({
  backgroundColor: '#0d1117',
  headerBackgroundColor: '#0d1117',
  oddRowBackgroundColor: '#0d1117',
  rowHoverColor: '#161b22',
  borderColor: '#30363d',
  foregroundColor: '#e6edf3',
  headerTextColor: '#00d4ff',
  selectedRowBackgroundColor: '#00d4ff11',
  fontSize: 13,
  fontFamily: 'Inter, system-ui, sans-serif',
  cellHorizontalPaddingScale: 0.8,
  rowVerticalPaddingScale: 0.5,
  spacing: 5,
  wrapperBorderRadius: 0,
})

interface DividendsGridProps {
  reloadKey: number
  onLastRun?: (lastRun: DividendsLastRun | null) => void
}

const KNOWN_KEYS_FOR_COLS = ['_id', 'symbol', 'companyName', 'exDate', 'dividendType', 'dividendAmount', 'dividendIsPercent', 'dividendPercent', 'dividendOnExPct', 'lastPrice', 'subject', 'sector', 'industry', 'faceValue', 'marketCap', 'recordDate', 'paymentDate', 'bcStartDate', 'bcEndDate', 'series', 'source', 'sources', 'bseVariant', 'bseScripCode', 'mismatchFields', 'createdAt', 'updatedAt', '__v', 'scrapedAt', 'enrichedAt']

function unknownKeysSignature(rows: DividendRecord[]): string {
  const known = new Set(KNOWN_KEYS_FOR_COLS)
  const seen = new Set<string>()
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue
    for (const key of Object.keys(row)) {
      if (known.has(key)) continue
      seen.add(key)
    }
  }
  return Array.from(seen).sort().join('|')
}

function rowKey(r: DividendRecord): string {
  return r._id ?? `${r.symbol}|${r.exDate}`
}

export function DividendsGrid({
  reloadKey,
  onLastRun,
}: DividendsGridProps) {
  const gridRef = useRef<AgGridReact>(null)
  const gridApiRef = useRef<GridApi | null>(null)
  const [gridReady, setGridReady] = useState(false)
  const pastInFlightRef = useRef(false)
  const upcomingInFlightRef = useRef(false)
  const renderedKeysRef = useRef<Set<string>>(new Set())
  const skeletonRowsRef = useRef<SkeletonRow[]>([])
  const reloadKeyRef = useRef(reloadKey)
  const lastScrollTopRef = useRef<number>(0)

  const {
    rows,
    hasMorePast,
    hasMoreUpcoming,
    initialLoaded,
    loadingUpcoming,
    loadMorePast,
    loadMoreUpcoming,
  } = useDividendsData({ reloadKey, onLastRun })

  const sampleForCols = rows.length > 0 ? rows.slice(0, 1) : rows
  const colsSignature = useMemo(() => unknownKeysSignature(sampleForCols), [sampleForCols])
  const columnDefs = useMemo(
    () => buildDynamicColumnDefs(sampleForCols),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [colsSignature]
  )


  // Sync row state into the grid via transactions to avoid full re-renders.
  useEffect(() => {
    const api = gridApiRef.current
    if (!api) return

    if (reloadKeyRef.current !== reloadKey) {
      reloadKeyRef.current = reloadKey
      renderedKeysRef.current = new Set()
      lastScrollTopRef.current = 0
      api.setGridOption('rowData', [])
    }

    const renderedKeys = renderedKeysRef.current
    const incomingKeys = new Set(rows.map(rowKey))

    const adds: DividendRecord[] = []
    const addIndices: number[] = []
    rows.forEach((row, idx) => {
      const k = rowKey(row)
      if (!renderedKeys.has(k)) {
        adds.push(row)
        addIndices.push(idx)
      }
    })

    const removes: DividendRecord[] = []
    api.forEachNode((node) => {
      const data = node.data as DividendRecord | undefined
      if (!data) return
      if (isSkeletonRow(data)) return
      if (!incomingKeys.has(rowKey(data))) removes.push(data)
    })

    if (adds.length === 0 && removes.length === 0) return

    if (removes.length > 0) {
      api.applyTransaction({ remove: removes })
      removes.forEach((r) => renderedKeys.delete(rowKey(r)))
    }
    if (adds.length > 0) {
      // Group consecutive insert indices so we can specify addIndex correctly.
      let i = 0
      while (i < adds.length) {
        const startIndex = addIndices[i]
        const batch: DividendRecord[] = [adds[i]]
        let j = i + 1
        while (j < adds.length && addIndices[j] === addIndices[j - 1] + 1) {
          batch.push(adds[j])
          j++
        }
        api.applyTransaction({ add: batch, addIndex: startIndex })
        batch.forEach((r) => renderedKeys.add(rowKey(r)))
        i = j
      }
    }
  }, [rows, reloadKey, gridReady])

  const onGridReady = useCallback((params: GridReadyEvent) => {
    gridApiRef.current = params.api
    setGridReady(true)
  }, [])

  const triggerLoadPast = useCallback(async () => {
    if (pastInFlightRef.current) return
    if (!hasMorePast) return
    if (!initialLoaded) return
    pastInFlightRef.current = true
    const api = gridApiRef.current

    // 1. Insert PAST_PAGE_SIZE skeleton rows at the top BEFORE the fetch.
    //    Anchor scroll so the user's view of real rows doesn't shift.
    let placeholders: SkeletonRow[] = []
    if (api) {
      placeholders = makeSkeletonRows(PAST_PAGE_SIZE, `sk-past-${Date.now()}`)
      skeletonRowsRef.current = [...skeletonRowsRef.current, ...placeholders]
      api.applyTransaction({ add: placeholders, addIndex: 0 })
      const root = document.querySelector('.ag-body-viewport') as HTMLElement | null
      if (root) {
        const newTop = root.scrollTop + PAST_PAGE_SIZE * ROW_HEIGHT
        root.scrollTop = newTop
        lastScrollTopRef.current = newTop
      }
    }

    try {
      const inserted = await loadMorePast()

      // 2. Replace the skeletons with the real rows.
      if (api) {
        api.applyTransaction({ remove: placeholders })
        skeletonRowsRef.current = skeletonRowsRef.current.filter(
          (s) => !placeholders.includes(s)
        )

        // If fewer real rows came back than placeholders, scroll up by the gap
        // so the user's anchor row stays in the same visual spot.
        const gap = PAST_PAGE_SIZE - inserted
        if (gap > 0) {
          const root = document.querySelector('.ag-body-viewport') as HTMLElement | null
          if (root) {
            const newTop = Math.max(0, root.scrollTop - gap * ROW_HEIGHT)
            root.scrollTop = newTop
            lastScrollTopRef.current = newTop
          }
        }
      }
    } finally {
      pastInFlightRef.current = false
    }
  }, [hasMorePast, initialLoaded, loadMorePast])

  const triggerLoadUpcoming = useCallback(async () => {
    if (upcomingInFlightRef.current) return
    if (!hasMoreUpcoming) return
    if (!initialLoaded) return
    upcomingInFlightRef.current = true
    try {
      await loadMoreUpcoming()
    } finally {
      upcomingInFlightRef.current = false
    }
  }, [hasMoreUpcoming, initialLoaded, loadMoreUpcoming])

  // Auto-fill: if the grid isn't tall enough to scroll yet, keep fetching
  // upcoming pages until it overflows or the API runs out.
  useEffect(() => {
    if (!initialLoaded) return
    if (!hasMoreUpcoming) return
    if (loadingUpcoming) return
    if (upcomingInFlightRef.current) return
    const viewport = document.querySelector('.ag-body-viewport') as HTMLElement | null
    if (!viewport) return
    if (viewport.scrollHeight > viewport.clientHeight) return
    triggerLoadUpcoming()
  }, [initialLoaded, hasMoreUpcoming, loadingUpcoming, rows.length, triggerLoadUpcoming])

  const onBodyScroll = useCallback(
    (event: BodyScrollEvent) => {
      if (event.direction !== 'vertical') return
      const api = event.api
      const range = api.getVerticalPixelRange()
      const prevTop = lastScrollTopRef.current
      const currTop = range.top
      const scrollingUp = currTop < prevTop
      lastScrollTopRef.current = currTop

      const totalRows = api.getDisplayedRowCount()
      const totalHeight = totalRows * ROW_HEIGHT

      if (scrollingUp && currTop <= TOP_TRIGGER_PX) {
        triggerLoadPast()
        return
      }
      if (!scrollingUp && totalHeight - range.bottom <= BOTTOM_TRIGGER_PX) {
        triggerLoadUpcoming()
      }
    },
    [triggerLoadPast, triggerLoadUpcoming]
  )

  const showInitialSkeleton = !initialLoaded && rows.length === 0

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <AgGridReact
        ref={gridRef}
        theme={darkTheme}
        columnDefs={columnDefs}
        onGridReady={onGridReady}
        onBodyScroll={onBodyScroll}
        rowHeight={ROW_HEIGHT}
        headerHeight={34}
        getRowId={(p) => {
          const data = p.data as DividendRecord
          if (isSkeletonRow(data)) return data._id
          return rowKey(data)
        }}
        getRowClass={(p) => (isSkeletonRow(p.data) ? 'div-skeleton-row' : '')}
        suppressScrollOnNewData
        defaultColDef={{
          resizable: true,
          suppressMovable: false,
        }}
        overlayNoRowsTemplate="<span style='color:#30363d;font-size:13px;font-family:JetBrains Mono,monospace'>// no upcoming dividends — try Refresh</span>"
        overlayLoadingTemplate="<span style='display:none'></span>"
        suppressCellFocus
      />

      {showInitialSkeleton && (
        <div style={{
          position: 'absolute',
          inset: '34px 0 0 0',
          background: '#0d1117',
          pointerEvents: 'none',
        }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonRow key={i} delay={i * 60} />
          ))}
        </div>
      )}

      {loadingUpcoming && initialLoaded && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: ROW_HEIGHT * 3,
          pointerEvents: 'none',
          background: 'linear-gradient(to top, #0d1117 0%, #0d1117 70%, transparent 100%)',
          zIndex: 5,
        }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonRow key={i} delay={i * 80} />
          ))}
          <LoadingChip label="loading more upcoming…" bottom />
        </div>
      )}

      <style>{`
        .div-urgent { background: #2a171766 !important; color: #ff7b7b !important; }
        @keyframes div-shimmer {
          0% { background-position: -300px 0; }
          100% { background-position: 300px 0; }
        }
        @keyframes div-fade-in {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: none; }
        }
        .ag-row { animation: div-fade-in 180ms ease-out; }
        .ag-row.div-skeleton-row { animation: none; }
      `}</style>
    </div>
  )
}

function SkeletonRow({ delay = 0 }: { delay?: number }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      height: ROW_HEIGHT,
      padding: '0 12px',
      borderBottom: '1px solid #161b22',
      opacity: 0,
      animation: `div-fade-in 220ms ease-out ${delay}ms forwards`,
    }}>
      {[80, 180, 60, 90, 70, 80, 70, 220, 60, 110].map((w, i) => (
        <div
          key={i}
          style={{
            width: w,
            height: 10,
            borderRadius: 3,
            background: 'linear-gradient(90deg, #161b22 0%, #21262d 50%, #161b22 100%)',
            backgroundSize: '300px 100%',
            animation: 'div-shimmer 1.4s linear infinite',
          }}
        />
      ))}
    </div>
  )
}

function LoadingChip({ label, bottom }: { label: string; bottom?: boolean }) {
  return (
    <div style={{
      position: 'absolute',
      [bottom ? 'bottom' : 'top']: 8,
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '4px 10px',
      background: '#161b22',
      border: '1px solid #30363d',
      borderRadius: 12,
      color: '#9ca3af',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 10,
      letterSpacing: '0.06em',
      whiteSpace: 'nowrap',
      boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
    }}>
      <span style={{
        display: 'inline-block',
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: '#00d4ff',
        marginRight: 6,
        animation: 'div-shimmer 1.4s linear infinite',
      }} />
      {label}
    </div>
  )
}
