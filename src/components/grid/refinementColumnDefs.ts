import type { ColDef, CellStyle } from 'ag-grid-community'
import { SourceCell } from './cellRenderers/SourceCell'
import { BodyCell } from './cellRenderers/BodyCell'
import { MlSectorCell } from './cellRenderers/MlSectorCell'
import { MlLabelsCell } from './cellRenderers/MlLabelsCell'
import { MlEntitiesCell } from './cellRenderers/MlEntitiesCell'
import { SentimentCell } from './cellRenderers/SentimentCell'
import { ResolutionSourceCell } from './cellRenderers/ResolutionSourceCell'
import { ConfidenceCell } from './cellRenderers/ConfidenceCell'
import { formatDate } from '../../utils/formatters'

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

export const refinementColumnDefs: ColDef[] = [
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
      color: '#e2e8f0cc',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    } as CellStyle,
  },
  {
    headerName: 'Body',
    field: 'body',
    flex: 3,
    minWidth: 260,
    sortable: false,
    cellRenderer: BodyCell,
  },
  {
    headerName: 'Sector',
    field: 'ml_sector',
    width: 110,
    sortable: false,
    cellRenderer: MlSectorCell,
  },
  {
    headerName: 'Labels',
    field: 'ml_labels',
    flex: 2,
    minWidth: 180,
    sortable: false,
    cellRenderer: MlLabelsCell,
  },
  {
    headerName: 'Topic',
    field: 'ml_topic',
    flex: 1,
    minWidth: 140,
    sortable: false,
    cellStyle: {
      fontFamily: "'Inter', system-ui, sans-serif",
      fontSize: '12px',
      color: '#e2e8f0cc',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    } as CellStyle,
  },
  {
    headerName: 'Sentiment',
    field: 'ml_sentiment_label',
    width: 115,
    sortable: false,
    cellRenderer: SentimentCell,
  },
  {
    headerName: 'Sent. Score',
    field: 'ml_sentiment_score',
    width: 96,
    sortable: false,
    cellStyle: mono,
    valueFormatter: (p) => (p.value != null ? parseFloat(p.value).toFixed(4) : '—'),
  },
  {
    headerName: 'Confidence',
    field: 'ml_confidence',
    width: 130,
    sortable: false,
    cellRenderer: ConfidenceCell,
  },
  {
    headerName: 'Entities',
    field: 'ml_entities',
    width: 160,
    sortable: false,
    cellRenderer: MlEntitiesCell,
  },
  {
    headerName: 'Res. Source',
    field: 'resolution_source',
    width: 105,
    sortable: false,
    cellRenderer: ResolutionSourceCell,
  },
  {
    headerName: 'Created',
    field: 'created_at',
    width: 160,
    sortable: false,
    cellStyle: dimMono,
    valueFormatter: (p) => formatDate(p.value),
  },
]
