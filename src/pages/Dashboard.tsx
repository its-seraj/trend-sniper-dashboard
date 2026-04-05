import { useState } from 'react'
import { Header } from '../components/layout/Header'
import { DataGrid } from '../components/grid/DataGrid'

export function Dashboard() {
  const [total, setTotal] = useState<number | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0d1117' }}>
      <Header total={total} />

      {/* Subheader bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 24px',
        background: '#0d1117',
        borderBottom: '1px solid #161b22',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            /ml/raw
          </span>
          <span style={{ color: '#30363d', fontSize: '10px' }}>·</span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            color: '#30363d',
            letterSpacing: '0.06em',
          }}>
            limit=20 · infinite scroll
          </span>
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '10px',
          color: '#00d4ff66',
          letterSpacing: '0.06em',
        }}>
          api.seraj.live
        </div>
      </div>

      {/* Grid fills the rest */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <DataGrid onTotalLoaded={setTotal} />
      </div>
    </div>
  )
}
