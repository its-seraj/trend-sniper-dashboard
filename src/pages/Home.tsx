import type { View } from '../App'
import { env } from '../config'

interface HomeProps {
  onNavigate: (view: View) => void
}

const mono = "'JetBrains Mono', monospace"
const sans = "'Inter', system-ui, sans-serif"

export function Home({ onNavigate }: HomeProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: '#0d1117',
      fontFamily: sans,
    }}>

      {/* Nav */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        height: '56px',
        borderBottom: '1px solid #161b22',
        flexShrink: 0,
      }}>
        <span style={{ fontFamily: mono, fontSize: '14px', fontWeight: 600, color: '#e6edf3', letterSpacing: '-0.02em' }}>
          Trend<span style={{ color: '#00d4ff' }}>_</span>Sniper
        </span>
        <span style={{ fontFamily: mono, fontSize: '10px', color: '#30363d', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          ML Intelligence Dashboard
        </span>
      </nav>

      {/* Hero */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 32px' }}>

        <div style={{ textAlign: 'center', maxWidth: '640px', width: '100%' }}>

          {/* Status badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '32px',
            padding: '5px 14px', borderRadius: '20px',
            background: '#00ff4108', border: '1px solid #00ff4122' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ff41',
              boxShadow: '0 0 8px #00ff41', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
            <span style={{ fontFamily: mono, fontSize: '11px', color: '#00ff41', letterSpacing: '0.06em' }}>
              LIVE · RAW FEED ACTIVE
            </span>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: mono, fontSize: '42px', fontWeight: 700, color: '#e6edf3',
            letterSpacing: '-0.04em', lineHeight: 1.1, margin: '0 0 16px' }}>
            Market<br />
            <span style={{ color: '#00d4ff' }}>Intelligence</span>
          </h1>

          <p style={{ fontSize: '15px', color: '#9ca3af', lineHeight: 1.7, margin: '0 0 48px',
            fontWeight: 400, maxWidth: '460px', marginInline: 'auto' }}>
            Real-time ML-processed financial news and corporate announcements
            from NSE, BSE, and other market data sources.
          </p>

          {/* Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '48px' }}>
            {[
              { label: 'Data Source', value: 'NSE / BSE', sub: 'Corporate Announcements' },
              { label: 'ML Pipeline', value: 'Sentiment', sub: 'NLP · Credibility Score' },
              { label: 'Update Freq', value: 'Real-time', sub: 'Infinite Scroll Feed' },
            ].map((card) => (
              <div key={card.label} style={{
                padding: '18px 16px',
                background: '#0d1117',
                border: '1px solid #161b22',
                borderRadius: '8px',
                textAlign: 'left',
                transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#30363d')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#161b22')}
              >
                <div style={{ fontFamily: mono, fontSize: '10px', color: '#30363d',
                  textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                  {card.label}
                </div>
                <div style={{ fontFamily: mono, fontSize: '14px', fontWeight: 600, color: '#00d4ff',
                  marginBottom: '4px' }}>
                  {card.value}
                </div>
                <div style={{ fontSize: '11px', color: '#9ca3af44' }}>
                  {card.sub}
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('feed')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 28px',
                background: 'transparent',
                border: '1px solid #00d4ff44',
                borderRadius: '6px',
                color: '#00d4ff',
                fontFamily: mono,
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#00d4ff11'
                e.currentTarget.style.borderColor = '#00d4ff'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = '#00d4ff44'
              }}
            >
              <span>Open Raw Feed</span>
              <span style={{ fontSize: '16px', lineHeight: 1 }}>→</span>
            </button>

            <button
              onClick={() => onNavigate('refinements')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 28px',
                background: 'transparent',
                border: '1px solid #a78bfa44',
                borderRadius: '6px',
                color: '#a78bfa',
                fontFamily: mono,
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#a78bfa11'
                e.currentTarget.style.borderColor = '#a78bfa'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = '#a78bfa44'
              }}
            >
              <span>ML Refinements</span>
              <span style={{ fontSize: '16px', lineHeight: 1 }}>→</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '16px 32px',
        borderTop: '1px solid #161b22',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{ fontFamily: mono, fontSize: '10px', color: '#30363d', letterSpacing: '0.06em' }}>
          {env.API_BASE_URL.replace('https://', '')} · {env.API_RAW_PATH}
        </span>
        <span style={{ fontFamily: mono, fontSize: '10px', color: '#30363d', letterSpacing: '0.06em' }}>
          {env.APP_HOST}
        </span>
      </footer>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  )
}
