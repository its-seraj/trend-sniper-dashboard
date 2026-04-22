import type { CustomCellRendererProps } from 'ag-grid-react'
import { useBadgeOverflow } from './useBadgeOverflow'

const badgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '1px 7px',
  borderRadius: '3px',
  fontSize: '10px',
  fontFamily: "'JetBrains Mono', monospace",
  fontWeight: 500,
  letterSpacing: '0.03em',
  background: '#34d3990d',
  border: '1px solid #34d39928',
  color: '#34d399aa',
  whiteSpace: 'nowrap' as const,
  flexShrink: 0,
}

const overflowStyle = {
  ...badgeStyle,
  background: '#30363d22',
  border: '1px solid #30363d',
  color: '#9ca3af',
}

export function MlEntitiesCell(props: CustomCellRendererProps) {
  const entities = props.value as string[]
  const { containerRef, measureRef, visible } = useBadgeOverflow(entities?.length ?? 0)

  if (!entities?.length) {
    return <span style={{ color: '#30363d', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}>—</span>
  }

  const hidden = entities.length - visible

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        ref={measureRef}
        style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none', display: 'flex', gap: '4px', top: 0, left: 0 }}
      >
        {entities.map((e) => (
          <span key={e} data-badge style={badgeStyle}>{e}</span>
        ))}
      </div>
      <div ref={containerRef} style={{ display: 'flex', gap: '4px', alignItems: 'center', overflow: 'hidden', width: '100%', height: '100%' }}>
        {entities.slice(0, visible).map((e) => (
          <span key={e} data-badge style={badgeStyle}>{e}</span>
        ))}
        {hidden > 0 && (
          <span title={entities.slice(visible).join(', ')} style={overflowStyle}>+{hidden}</span>
        )}
      </div>
    </div>
  )
}
