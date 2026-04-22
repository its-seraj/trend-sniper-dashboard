import type { CustomCellRendererProps } from 'ag-grid-react'

const styleMap: Record<string, { color: string; background: string; border: string }> = {
  ml:     { color: '#a78bfa', background: '#a78bfa11', border: '1px solid #a78bfa33' },
  hybrid: { color: '#f59e0b', background: '#f59e0b11', border: '1px solid #f59e0b33' },
  rule:   { color: '#34d399', background: '#34d39911', border: '1px solid #34d39933' },
}

const fallback = { color: '#6b7280', background: 'transparent', border: '1px solid #6b728044' }

export function ResolutionSourceCell(props: CustomCellRendererProps) {
  const value = (props.value as string) ?? ''
  const s = styleMap[value.toLowerCase()] ?? fallback

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
