import type { CustomCellRendererProps } from 'ag-grid-react'

function confidenceColor(val: number): string {
  if (val >= 0.7) return '#00ff41'
  if (val >= 0.4) return '#f59e0b'
  return '#ff4444'
}

export function ConfidenceCell(props: CustomCellRendererProps) {
  const raw = props.value
  if (raw == null) return <span style={{ color: '#30363d', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}>—</span>

  const val = parseFloat(raw)
  const pct = Math.round(val * 100)
  const color = confidenceColor(val)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%', height: '100%' }}>
      <div style={{ flex: 1, height: '4px', background: '#30363d', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '2px', transition: 'width 0.2s' }} />
      </div>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '11px',
        color,
        minWidth: '32px',
        textAlign: 'right',
      }}>
        {pct}%
      </span>
    </div>
  )
}
