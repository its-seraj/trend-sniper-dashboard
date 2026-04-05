import type { CustomCellRendererProps } from 'ag-grid-react'

const styleMap: Record<string, { color: string; background: string; border: string }> = {
  processed: { color: '#00d4ff', background: '#00d4ff11', border: '1px solid #00d4ff33' },
  pending:   { color: '#f59e0b', background: '#f59e0b11', border: '1px solid #f59e0b33' },
  failed:    { color: '#ff4444', background: '#ff444411', border: '1px solid #ff444433' },
}

export function StatusCell(props: CustomCellRendererProps) {
  const value = (props.value as string) ?? ''
  const s = styleMap[value.toLowerCase()] ?? { color: '#30363d', background: 'transparent', border: '1px solid #30363d44' }
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '11px',
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 500,
      letterSpacing: '0.04em',
      ...s,
    }}>
      {value || '—'}
    </span>
  )
}
