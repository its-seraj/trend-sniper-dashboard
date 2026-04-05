import { useState, useCallback, useRef } from 'react'
import { DataGrid } from '../components/grid/DataGrid'
import type { MlRecord } from '../types'
import { env } from '../config'

const mono = "'JetBrains Mono', monospace"

interface FeedPageProps {
  onBack: () => void
}

export function FeedPage({ onBack }: FeedPageProps) {
  const [total, setTotal] = useState<number | null>(null)
  const [newCount, setNewCount] = useState(0)
  const flashRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [flashing, setFlashing] = useState(false)

  const handleNewItem = useCallback((_item: MlRecord) => {
    setNewCount((n) => n + 1)
    setFlashing(true)
    if (flashRef.current) clearTimeout(flashRef.current)
    flashRef.current = setTimeout(() => setFlashing(false), 1200)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0d1117' }}>

      {/* Header */}
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
          {/* Back button */}
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
            {env.API_RAW_PATH}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* Total count */}
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

          {/* New items counter */}
          {newCount > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 10px',
              borderRadius: '4px',
              background: flashing ? '#00ff4118' : '#00ff4108',
              border: `1px solid ${flashing ? '#00ff4155' : '#00ff4122'}`,
              transition: 'all 0.3s',
            }}>
              <span style={{ fontFamily: mono, fontSize: '10px', color: '#00ff41', letterSpacing: '0.04em' }}>
                +{newCount} new
              </span>
            </div>
          )}

          {/* Live indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: flashing ? '#00ff41' : '#00ff4166',
              boxShadow: flashing ? '0 0 8px #00ff41, 0 0 16px #00ff4155' : '0 0 4px #00ff4144',
              display: 'inline-block',
              transition: 'all 0.3s',
              animation: 'pulse 2s ease-in-out infinite',
            }} />
            <span style={{ fontFamily: mono, fontSize: '10px', color: '#00ff4166', letterSpacing: '0.06em' }}>
              STREAM
            </span>
          </div>
        </div>
      </header>

      {/* Grid fills rest */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <DataGrid onTotalLoaded={setTotal} onNewItem={handleNewItem} />
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  )
}
