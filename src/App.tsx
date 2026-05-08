import { useState, useEffect } from 'react'
import { Home } from './pages/Home'
import { FeedPage } from './pages/FeedPage'
import { RefinementsPage } from './pages/RefinementsPage'
import { DividendsPage } from './pages/DividendsPage'

export type View = 'home' | 'feed' | 'refinements' | 'dividends'

function getViewFromHash(): View {
  if (window.location.hash === '#/raw') return 'feed'
  if (window.location.hash === '#/refinements') return 'refinements'
  if (window.location.hash === '#/dividends') return 'dividends'
  return 'home'
}

export default function App() {
  const [view, setView] = useState<View>(getViewFromHash)

  useEffect(() => {
    const onHashChange = () => setView(getViewFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = (v: View) => {
    if (v === 'feed') window.location.hash = '#/raw'
    else if (v === 'refinements') window.location.hash = '#/refinements'
    else if (v === 'dividends') window.location.hash = '#/dividends'
    else window.location.hash = '#/'
    setView(v)
  }

  if (view === 'feed') return <FeedPage onBack={() => navigate('home')} />
  if (view === 'refinements') return <RefinementsPage onBack={() => navigate('home')} />
  if (view === 'dividends') return <DividendsPage onBack={() => navigate('home')} />
  return <Home onNavigate={navigate} />
}
