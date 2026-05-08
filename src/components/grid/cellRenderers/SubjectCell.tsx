import type { CustomCellRendererProps } from 'ag-grid-react'

export function SubjectCell(props: CustomCellRendererProps) {
  const text = (props.value as string) || ''
  if (!text) return <span style={{ color: '#6b7280' }}>—</span>
  return (
    <span title={text} style={{
      color: '#9ca3af',
      fontSize: '12px',
      fontFamily: "'Inter', system-ui, sans-serif",
      lineHeight: '1.5',
      display: 'block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }}>
      {text}
    </span>
  )
}
