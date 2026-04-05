import type { CustomCellRendererProps } from 'ag-grid-react'

const styleMap: Record<string, { color: string; background: string; border: string }> = {
  positive: { color: '#00ff41', background: '#00ff4111', border: '1px solid #00ff4133' },
  negative: { color: '#ff4444', background: '#ff444411', border: '1px solid #ff444433' },
  neutral:  { color: '#9ca3af', background: '#9ca3af11', border: '1px solid #9ca3af22' },
}

export function SentimentCell(props: CustomCellRendererProps) {
  const value = props.value as string
  const s = styleMap[value] ?? styleMap.neutral
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
      {value ?? '—'}
    </span>
  )
}
