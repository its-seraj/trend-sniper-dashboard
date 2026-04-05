import type { CustomCellRendererProps } from 'ag-grid-react'
import { truncateText } from '../../../utils/formatters'

export function BodyCell(props: CustomCellRendererProps) {
  const text = props.value as string
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
      {truncateText(text, 160)}
    </span>
  )
}
