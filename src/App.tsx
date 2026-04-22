import { useState, useEffect } from 'react'
import { Home } from './pages/Home'
import { FeedPage } from './pages/FeedPage'
import { RefinementsPage } from './pages/RefinementsPage'

export type View = 'home' | 'feed' | 'refinements'

function getViewFromHash(): View {
  if (window.location.hash === '#/raw') return 'feed'
  if (window.location.hash === '#/refinements') return 'refinements'
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
    else window.location.hash = '#/'
    setView(v)
  }

  if (view === 'feed') return <FeedPage onBack={() => navigate('home')} />
  if (view === 'refinements') return <RefinementsPage onBack={() => navigate('home')} />
  return <Home onNavigate={navigate} />
}
