interface HeaderProps {
  total: number | null
}

export function Header({ total }: HeaderProps) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      height: '56px',
      background: '#0d1117',
      borderBottom: '1px solid #30363d',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Pulse dot */}
        <span style={{
          display: 'inline-block',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#00ff41',
          boxShadow: '0 0 8px #00ff41, 0 0 16px #00ff4144',
          animation: 'pulse 2s ease-in-out infinite',
        }} />
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '15px',
          fontWeight: 600,
          color: '#e6edf3',
          letterSpacing: '-0.02em',
        }}>
          Trend<span style={{ color: '#00d4ff' }}>_</span>Sniper
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '10px',
          color: '#30363d',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          paddingLeft: '8px',
          borderLeft: '1px solid #30363d',
          marginLeft: '4px',
        }}>
          ML Intelligence
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            records
          </span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '14px',
            fontWeight: 700,
            color: total !== null ? '#00ff41' : '#30363d',
            letterSpacing: '-0.02em',
          }}>
            {total !== null ? total.toLocaleString() : '—'}
          </span>
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '10px',
          color: '#30363d',
          letterSpacing: '0.06em',
        }}>
          NSE · BSE · RAW FEED
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </header>
  )
}
