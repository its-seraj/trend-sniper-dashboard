import { useState, useCallback, useEffect } from 'react'
import { DividendsGrid } from '../components/grid/DividendsGrid'
import { fetchDividendCounts, refreshDividends } from '../api/dividendsApi'
import type { DividendsCounts, DividendsLastRun } from '../types'

const mono = "'JetBrains Mono', monospace"

interface DividendsPageProps {
  onBack: () => void
}

export function DividendsPage({ onBack }: DividendsPageProps) {
  const [counts, setCounts] = useState<DividendsCounts | null>(null)
  const [lastRun, setLastRun] = useState<DividendsLastRun | null>(null)

  const [reloadKey, setReloadKey] = useState(0)

  const [refreshing, setRefreshing] = useState(false)
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null)

  const loadCounts = useCallback(async () => {
    try {
      const c = await fetchDividendCounts()
      setCounts(c)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    loadCounts()
  }, [loadCounts, reloadKey])

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      const result = await refreshDividends()
      setToast({
        ok: result.success,
        msg: `+${result.inserted} new · ${result.updated} updated · ${result.skipped} unchanged${
          result.errors?.length ? ` · ${result.errors.length} errors` : ''
        }`,
      })
      setReloadKey((k) => k + 1)
    } catch (err) {
      setToast({ ok: false, msg: (err as Error).message || 'Refresh failed' })
    } finally {
      setRefreshing(false)
      setTimeout(() => setToast(null), 5000)
    }
  }, [])

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
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#00d4ff44'
              e.currentTarget.style.color = '#00d4ff'
            }}
            onMouseLeave={(e) => {
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
            /dividends
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: mono, fontSize: '10px', color: '#30363d', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              upcoming
            </span>
            <span style={{
              fontFamily: mono,
              fontSize: '13px',
              fontWeight: 700,
              color: counts ? '#e6edf3' : '#30363d',
              letterSpacing: '-0.02em',
              transition: 'color 0.3s',
            }}>
              {counts ? counts.upcoming.toLocaleString() : '—'}
            </span>
          </div>

          <div style={{ width: '1px', height: '14px', background: '#30363d' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: mono, fontSize: '10px', color: '#30363d', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              past
            </span>
            <span style={{
              fontFamily: mono,
              fontSize: '13px',
              fontWeight: 700,
              color: counts ? '#9ca3af' : '#30363d',
              letterSpacing: '-0.02em',
              transition: 'color 0.3s',
            }}>
              {counts ? counts.past.toLocaleString() : '—'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#facc1566',
              boxShadow: '0 0 4px #facc1544',
              display: 'inline-block',
            }} />
            <span style={{ fontFamily: mono, fontSize: '10px', color: '#facc1566', letterSpacing: '0.06em' }}>
              NSE · DIV
            </span>
          </div>

          <div style={{ width: '1px', height: '14px', background: '#30363d' }} />

          <span style={{ fontFamily: mono, fontSize: '10px', color: '#30363d', letterSpacing: '0.06em' }}>
            {lastRun
              ? `last run: ${new Date(lastRun.at).toLocaleString('en-IN')} (${lastRun.source})`
              : 'no scrape yet'}
          </span>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              background: refreshing ? 'transparent' : '#facc1511',
              border: `1px solid ${refreshing ? '#30363d' : '#facc1544'}`,
              borderRadius: '4px',
              color: refreshing ? '#6b7280' : '#facc15',
              fontFamily: mono,
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.04em',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              if (refreshing) return
              e.currentTarget.style.background = '#facc1522'
              e.currentTarget.style.borderColor = '#facc15'
            }}
            onMouseLeave={(e) => {
              if (refreshing) return
              e.currentTarget.style.background = '#facc1511'
              e.currentTarget.style.borderColor = '#facc1544'
            }}
          >
            {refreshing ? 'Scraping NSE…' : 'Refresh now'}
          </button>
        </div>
      </header>

      <div style={{ flex: 1, minHeight: 0 }}>
        <DividendsGrid
          reloadKey={reloadKey}
          onLastRun={setLastRun}
        />
      </div>

      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '10px 14px',
          borderRadius: '4px',
          background: toast.ok ? '#14532d' : '#7f1d1d',
          color: '#e6edf3',
          fontFamily: mono,
          fontSize: '12px',
          letterSpacing: '0.02em',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          zIndex: 100,
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}

