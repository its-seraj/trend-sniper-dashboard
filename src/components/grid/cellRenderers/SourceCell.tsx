import { useState } from 'react'
import type { CustomCellRendererProps } from 'ag-grid-react'
import { getSource } from '../../../data/sources'

export function SourceCell(props: CustomCellRendererProps) {
  const sourceId = props.data?.source_id as string
  const sourceName = props.value as string
  const source = getSource(sourceId)
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', overflow: 'hidden' }}>
      {source && !imgFailed ? (
        <img
          src={source.favicon}
          alt=""
          width={13}
          height={13}
          onError={() => setImgFailed(true)}
          style={{ borderRadius: '2px', flexShrink: 0, opacity: 0.85 }}
        />
      ) : (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '13px',
          height: '13px',
          borderRadius: '2px',
          background: '#30363d',
          fontSize: '8px',
          color: '#9ca3af',
          flexShrink: 0,
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 700,
        }}>
          {(sourceId?.[0] ?? sourceName?.[0] ?? '?').toUpperCase()}
        </span>
      )}
      <span style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: '12px',
        fontWeight: 500,
        color: '#00d4ff',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {source?.name ?? sourceName ?? '—'}
      </span>
    </div>
  )
}
