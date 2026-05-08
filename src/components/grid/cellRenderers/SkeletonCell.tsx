import type { CustomCellRendererProps } from 'ag-grid-react'

export function SkeletonCell(_props: CustomCellRendererProps) {
  return (
    <div style={{
      width: '60%',
      height: 10,
      borderRadius: 3,
      background: 'linear-gradient(90deg, #161b22 0%, #21262d 50%, #161b22 100%)',
      backgroundSize: '300px 100%',
      animation: 'div-shimmer 1.4s linear infinite',
      marginTop: 11,
    }} />
  )
}
