import type { CustomCellRendererProps } from 'ag-grid-react'
import { useBadgeOverflow } from './useBadgeOverflow'

interface LabelCandidate {
  label: string
  score: number
  matches: string[]
}

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

export function LabelCell(props: CustomCellRendererProps) {
  const candidates = props.value as LabelCandidate[]
  const { containerRef, measureRef, visible } = useBadgeOverflow(candidates?.length ?? 0)

  if (!candidates?.length) {
    return <span style={{ color: '#30363d', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}>—</span>
  }

  const hidden = candidates.length - visible

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Hidden measurement div — renders all badges off-screen */}
      <div
        ref={measureRef}
        style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none', display: 'flex', gap: '4px', top: 0, left: 0 }}
      >
        {candidates.map((c) => (
          <span key={c.label} data-badge style={badgeStyle}>
            {c.label}
          </span>
        ))}
      </div>
      {/* Visible container */}
      <div ref={containerRef} style={{ display: 'flex', gap: '4px', alignItems: 'center', overflow: 'hidden', width: '100%', height: '100%' }}>
        {candidates.slice(0, visible).map((c) => (
          <span key={c.label} data-badge title={`score: ${c.score} · ${c.matches.join(', ')}`} style={badgeStyle}>
            {c.label}
          </span>
        ))}
        {hidden > 0 && (
          <span title={candidates.slice(visible).map(c => c.label).join(', ')} style={overflowStyle}>
            +{hidden}
          </span>
        )}
      </div>
    </div>
  )
}
