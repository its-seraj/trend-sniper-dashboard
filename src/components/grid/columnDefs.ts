import type { ColDef, CellStyle } from 'ag-grid-community'
import { SentimentCell } from './cellRenderers/SentimentCell'
import { StatusCell } from './cellRenderers/StatusCell'
import { BodyCell } from './cellRenderers/BodyCell'
import { SourceCell } from './cellRenderers/SourceCell'
import { formatDate } from '../../utils/formatters'

const mono: CellStyle = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '12px',
  color: '#9ca3af',
}

const dimMono: CellStyle = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '11px',
  color: '#30363d',
}

export const columnDefs: ColDef[] = [
  {
    headerName: 'ID',
    field: 'id',
    width: 72,
    sortable: false,
    pinned: 'left',
    cellStyle: dimMono,
  },
  {
    headerName: 'Source',
    field: 'source_name',
    width: 175,
    sortable: false,
    cellRenderer: SourceCell,
  },
  {
    headerName: 'Title',
    field: 'title',
    flex: 2,
    minWidth: 220,
    sortable: false,
    cellStyle: {
      fontFamily: "'Inter', system-ui, sans-serif",
      fontSize: '13px',
      fontWeight: '400',
      color: '#e6edf3',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    } as CellStyle,
  },
  {
    headerName: 'Body',
    field: 'body',
    flex: 3,
    minWidth: 280,
    sortable: false,
    cellRenderer: BodyCell,
  },
  {
    headerName: 'Sentiment',
    field: 'sentiment_label',
    width: 115,
    sortable: false,
    cellRenderer: SentimentCell,
  },
  {
    headerName: 'Score',
    field: 'sentiment_score',
    width: 88,
    sortable: false,
    cellStyle: mono,
    valueFormatter: (p) => (p.value != null ? parseFloat(p.value).toFixed(3) : '—'),
  },
  {
    headerName: 'Credibility',
    field: 'credibility',
    width: 100,
    sortable: false,
    cellStyle: mono,
    valueFormatter: (p) => (p.value != null ? `${p.value}` : '—'),
  },
  {
    headerName: 'Published',
    field: 'published_at',
    width: 160,
    sortable: false,
    cellStyle: dimMono,
    valueFormatter: (p) => formatDate(p.value),
  },
  {
    headerName: 'ML Status',
    field: 'ml_status',
    width: 110,
    sortable: false,
    cellRenderer: StatusCell,
  },
]
