import { useState } from 'react'
import { RefinementsGrid } from '../components/grid/RefinementsGrid'

const mono = "'JetBrains Mono', monospace"

interface RefinementsPageProps {
  onBack: () => void
}

export function RefinementsPage({ onBack }: RefinementsPageProps) {
  const [total, setTotal] = useState<number | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0d1117' }}>

      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: '48px',
        borderBottom: '1px solid #161b22',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              background: 'transparent',
              border: '1px solid #30363d',
              borderRadius: '4px',
              color: '#9ca3af',
              fontFamily: mono,
              fontSize: '11px',
              cursor: 'pointer',
              transition: 'all 0.15s',
              letterSpacing: '0.04em',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#00d4ff44'
              e.currentTarget.style.color = '#00d4ff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#30363d'
              e.currentTarget.style.color = '#9ca3af'
            }}
          >
            <span style={{ fontSize: '13px', lineHeight: 1 }}>←</span>
            <span>Dashboard</span>
          </button>

          <div style={{ width: '1px', height: '16px', background: '#30363d' }} />

          <span style={{ fontFamily: mono, fontSize: '13px', fontWeight: 600, color: '#e6edf3', letterSpacing: '-0.02em' }}>
            Trend<span style={{ color: '#00d4ff' }}>_</span>Sniper
          </span>

          <span style={{ fontFamily: mono, fontSize: '10px', color: '#30363d', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            /refinements
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: mono, fontSize: '10px', color: '#30363d', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              total
            </span>
            <span style={{
              fontFamily: mono,
              fontSize: '13px',
              fontWeight: 700,
              color: total !== null ? '#e6edf3' : '#30363d',
              letterSpacing: '-0.02em',
              transition: 'color 0.3s',
            }}>
              {total !== null ? total.toLocaleString() : '—'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#a78bfa66',
              boxShadow: '0 0 4px #a78bfa44',
              display: 'inline-block',
            }} />
            <span style={{ fontFamily: mono, fontSize: '10px', color: '#a78bfa66', letterSpacing: '0.06em' }}>
              ML
            </span>
          </div>
        </div>
      </header>

      <div style={{ flex: 1, minHeight: 0 }}>
        <RefinementsGrid onTotalLoaded={setTotal} />
      </div>
    </div>
  )
}
