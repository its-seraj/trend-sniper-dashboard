import { useCallback, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import type { GridReadyEvent } from 'ag-grid-community'
import { themeAlpine } from 'ag-grid-community'
import { refinementColumnDefs } from './refinementColumnDefs'
import { useRefinementsDataSource } from '../../hooks/useRefinementsDataSource'

const PAGE_LIMIT = 30

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

interface RefinementsGridProps {
  onTotalLoaded?: (total: number) => void
}

export function RefinementsGrid({ onTotalLoaded }: RefinementsGridProps) {
  const gridRef = useRef<AgGridReact>(null)
  const datasource = useRefinementsDataSource(onTotalLoaded)

  const onGridReady = useCallback(
    (params: GridReadyEvent) => {
      params.api.setGridOption('datasource', datasource)
    },
    [datasource]
  )

  return (
    <AgGridReact
      ref={gridRef}
      theme={darkTheme}
      columnDefs={refinementColumnDefs}
      rowModelType="infinite"
      onGridReady={onGridReady}
      cacheBlockSize={PAGE_LIMIT}
      maxBlocksInCache={10}
      rowBuffer={0}
      infiniteInitialRowCount={PAGE_LIMIT}
      rowHeight={32}
      headerHeight={34}
      defaultColDef={{
        resizable: true,
        suppressMovable: false,
      }}
      overlayNoRowsTemplate="<span style='color:#30363d;font-size:13px;font-family:JetBrains Mono,monospace'>// no records found</span>"
      suppressCellFocus
    />
  )
}
