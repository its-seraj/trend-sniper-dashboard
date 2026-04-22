import type { CustomCellRendererProps } from 'ag-grid-react'

const sectorColors: Record<string, { color: string; background: string; border: string }> = {
  banking:   { color: '#60a5fa', background: '#60a5fa0d', border: '1px solid #60a5fa28' },
  market:    { color: '#00d4ff', background: '#00d4ff0d', border: '1px solid #00d4ff28' },
  it:        { color: '#a78bfa', background: '#a78bfa0d', border: '1px solid #a78bfa28' },
  energy:    { color: '#fb923c', background: '#fb923c0d', border: '1px solid #fb923c28' },
  pharma:    { color: '#34d399', background: '#34d3990d', border: '1px solid #34d39928' },
  fmcg:      { color: '#f472b6', background: '#f472b60d', border: '1px solid #f472b628' },
  auto:      { color: '#facc15', background: '#facc150d', border: '1px solid #facc1528' },
  metals:    { color: '#94a3b8', background: '#94a3b80d', border: '1px solid #94a3b828' },
  realty:    { color: '#f87171', background: '#f871710d', border: '1px solid #f8717128' },
  currency:  { color: '#2dd4bf', background: '#2dd4bf0d', border: '1px solid #2dd4bf28' },
  economy:   { color: '#818cf8', background: '#818cf80d', border: '1px solid #818cf828' },
  telecom:   { color: '#e879f9', background: '#e879f90d', border: '1px solid #e879f928' },
  commodity: { color: '#fb7185', background: '#fb71850d', border: '1px solid #fb718528' },
  general:   { color: '#9ca3af', background: '#9ca3af0d', border: '1px solid #9ca3af22' },
}

const fallback = { color: '#9ca3af', background: '#9ca3af0d', border: '1px solid #9ca3af22' }

export function MlSectorCell(props: CustomCellRendererProps) {
  const sector = props.value as string
  if (!sector) return <span style={{ color: '#30363d', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}>—</span>

  const s = sectorColors[sector.toLowerCase()] ?? fallback

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
      {sector}
    </span>
  )
}
