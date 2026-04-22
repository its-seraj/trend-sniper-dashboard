import type { CustomCellRendererProps } from 'ag-grid-react'
import { useBadgeOverflow } from './useBadgeOverflow'
import type { MlLabel } from '../../../types'

const badgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '1px 7px',
  borderRadius: '3px',
  fontSize: '10px',
  fontFamily: "'JetBrains Mono', monospace",
  fontWeight: 500,
  letterSpacing: '0.03em',
  background: '#a78bfa0d',
  border: '1px solid #a78bfa28',
  color: '#a78bfaaa',
  whiteSpace: 'nowrap' as const,
  flexShrink: 0,
}

const overflowStyle = {
  ...badgeStyle,
  background: '#30363d22',
  border: '1px solid #30363d',
  color: '#9ca3af',
}

export function MlLabelsCell(props: CustomCellRendererProps) {
  const labels = props.value as MlLabel[]
  const { containerRef, measureRef, visible } = useBadgeOverflow(labels?.length ?? 0)

  if (!labels?.length) {
    return <span style={{ color: '#30363d', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}>—</span>
  }

  const hidden = labels.length - visible

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        ref={measureRef}
        style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none', display: 'flex', gap: '4px', top: 0, left: 0 }}
      >
        {labels.map((l) => (
          <span key={l.label} data-badge style={badgeStyle}>{l.label}</span>
        ))}
      </div>
      <div ref={containerRef} style={{ display: 'flex', gap: '4px', alignItems: 'center', overflow: 'hidden', width: '100%', height: '100%' }}>
        {labels.slice(0, visible).map((l) => (
          <span key={l.label} data-badge title={`score: ${l.score.toFixed(4)}`} style={badgeStyle}>{l.label}</span>
        ))}
        {hidden > 0 && (
          <span title={labels.slice(visible).map(l => l.label).join(', ')} style={overflowStyle}>+{hidden}</span>
        )}
      </div>
    </div>
  )
}
