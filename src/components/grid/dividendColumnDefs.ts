import type { ColDef, CellStyle, ValueFormatterParams } from 'ag-grid-community'
import type { DividendRecord } from '../../types'
import { SubjectCell } from './cellRenderers/SubjectCell'
import { SkeletonCell } from './cellRenderers/SkeletonCell'

export const SKELETON_FLAG = '__skeleton'

export type SkeletonRow = { _id: string; [SKELETON_FLAG]: true }

export function makeSkeletonRows(count: number, prefix: string): SkeletonRow[] {
  return Array.from({ length: count }, (_, i) => ({
    _id: `${prefix}-${i}`,
    [SKELETON_FLAG]: true,
  }))
}

export function isSkeletonRow(row: unknown): row is SkeletonRow {
  return Boolean(row && typeof row === 'object' && (row as Record<string, unknown>)[SKELETON_FLAG])
}

const mono: CellStyle = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '12px',
  color: '#9ca3af',
}

const dimMono: CellStyle = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '11px',
  color: '#6b7280ce',
}

const symbolStyle: CellStyle = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '12px',
  fontWeight: '600',
  color: '#00d4ff',
  letterSpacing: '0.02em',
}

const numStyle: CellStyle = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '12px',
  color: '#e6edf3',
  textAlign: 'right',
}

function fmtDateShort(value: string | null | undefined): string {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d)
}

function fmtNum(value: number | null | undefined, dp = 2): string {
  if (value == null || Number.isNaN(value)) return '—'
  return value.toLocaleString('en-IN', { maximumFractionDigits: dp, minimumFractionDigits: dp })
}

function fmtCr(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—'
  return (value / 1e7).toLocaleString('en-IN', { maximumFractionDigits: 0 })
}

function daysToEx(value: string | null | undefined): number | null {
  if (!value) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(value)
  if (Number.isNaN(target.getTime())) return null
  return Math.ceil((target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))
}

export const dividendColumnDefs: ColDef<DividendRecord>[] = [
  {
    headerName: 'Symbol',
    field: 'symbol',
    width: 120,
    sortable: true,
    cellStyle: symbolStyle,
  },
  {
    headerName: 'Company',
    field: 'companyName',
    flex: 2,
    minWidth: 200,
    sortable: true,
    cellStyle: {
      fontFamily: "'Inter', system-ui, sans-serif",
      fontSize: '13px',
      color: '#e2e8f0cc',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    } as CellStyle,
  },
  {
    headerName: 'Ex-Date',
    field: 'exDate',
    width: 120,
    sortable: true,
    cellStyle: mono,
    valueFormatter: (p) => fmtDateShort(p.value),
  },
  {
    headerName: 'Days',
    width: 70,
    sortable: true,
    cellStyle: { ...numStyle, textAlign: 'right' as const },
    valueGetter: (p) => daysToEx(p.data?.exDate),
    cellClassRules: {
      'div-urgent': (p) => {
        const d = p.value as number | null
        return d != null && d <= 3
      },
    },
  },
  {
    headerName: 'Amount (₹)',
    field: 'dividendAmount',
    width: 110,
    sortable: true,
    cellStyle: numStyle,
    valueFormatter: (p) => {
      const r = p.data
      if (r && r.dividendAmount == null && r.dividendIsPercent && r.dividendPercent != null) {
        return `${r.dividendPercent}% FV`
      }
      return fmtNum(p.value)
    },
  },
  {
    headerName: 'Ex-Yield %',
    field: 'dividendOnExPct',
    width: 100,
    sortable: true,
    cellStyle: numStyle,
    valueFormatter: (p) => fmtNum(p.value, 2),
  },
  {
    headerName: 'Last Price',
    field: 'lastPrice',
    width: 110,
    sortable: true,
    cellStyle: numStyle,
    valueFormatter: (p) => fmtNum(p.value, 2),
  },
  {
    headerName: 'Subject',
    field: 'subject',
    flex: 2,
    minWidth: 200,
    sortable: false,
    cellRenderer: SubjectCell,
  },
  {
    headerName: 'Type',
    field: 'dividendType',
    width: 90,
    sortable: true,
    cellStyle: mono,
  },
  {
    headerName: 'Sector',
    field: 'sector',
    width: 150,
    sortable: true,
    cellStyle: {
      fontFamily: "'Inter', system-ui, sans-serif",
      fontSize: '12px',
      color: '#a78bfa',
    } as CellStyle,
    valueFormatter: (p) => p.value || '—',
  },
  {
    headerName: 'Industry',
    field: 'industry',
    width: 160,
    sortable: true,
    cellStyle: {
      fontFamily: "'Inter', system-ui, sans-serif",
      fontSize: '12px',
      color: '#a78bfa99',
    } as CellStyle,
    valueFormatter: (p) => p.value || '—',
  },
  {
    headerName: 'Face Value (₹)',
    field: 'faceValue',
    width: 110,
    sortable: true,
    cellStyle: numStyle,
    valueFormatter: (p) => fmtNum(p.value, 2),
  },
  {
    headerName: 'Mkt Cap (Cr)',
    field: 'marketCap',
    width: 110,
    sortable: true,
    cellStyle: numStyle,
    valueFormatter: (p) => fmtCr(p.value),
  },
]

const KNOWN_FIELDS = new Set<string>(
  dividendColumnDefs.flatMap((c) => (typeof c.field === 'string' ? [c.field] : []))
)

const HIDDEN_FIELDS = new Set<string>([
  '_id',
  '__v',
  'createdAt',
  'updatedAt',
  'scrapedAt',
  'enrichedAt',
  'dividendIsPercent',
  'dividendPercent',
  'mismatchFields',
  'recordDate',
  'paymentDate',
  'source',
  'sources',
  'bcStartDate',
  'bcEndDate',
  'series',
  'bseVariant',
  'bseScripCode',
])

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/

function humanizeKey(key: string): string {
  return key
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatDynamic(value: unknown): string {
  if (value == null || value === '') return '—'
  if (typeof value === 'number') return fmtNum(value, 2)
  if (typeof value === 'boolean') return value ? 'yes' : 'no'
  if (typeof value === 'string') {
    if (ISO_DATE_RE.test(value)) return fmtDateShort(value)
    return value
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '—'
    return value.map((v) => (typeof v === 'string' ? v : JSON.stringify(v))).join(', ')
  }
  return JSON.stringify(value)
}

export function buildDynamicColumnDefs(rows: DividendRecord[]): ColDef<DividendRecord>[] {
  const seen = new Set<string>()
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue
    for (const key of Object.keys(row)) {
      if (KNOWN_FIELDS.has(key) || HIDDEN_FIELDS.has(key)) continue
      seen.add(key)
    }
  }
  if (seen.size === 0) return dividendColumnDefs
  const extras: ColDef<DividendRecord>[] = Array.from(seen).map((key) => ({
    headerName: humanizeKey(key),
    field: key as keyof DividendRecord,
    width: 140,
    sortable: true,
    cellStyle: dimMono,
    valueFormatter: (p: ValueFormatterParams<DividendRecord>) => formatDynamic(p.value),
  }))
  return withSkeletonRenderers([...dividendColumnDefs, ...extras])
}

function withSkeletonRenderers(defs: ColDef<DividendRecord>[]): ColDef<DividendRecord>[] {
  return defs.map((def) => {
    const originalRenderer = def.cellRenderer
    return {
      ...def,
      cellRendererSelector: (params) => {
        if (isSkeletonRow(params.data)) {
          return { component: SkeletonCell }
        }
        if (originalRenderer) return { component: originalRenderer }
        return undefined
      },
      cellRenderer: undefined,
    }
  })
}
