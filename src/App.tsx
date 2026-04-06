import { useState, useEffect } from 'react'
import { Home } from './pages/Home'
import { FeedPage } from './pages/FeedPage'

export type View = 'home' | 'feed'

function getViewFromHash(): View {
  return window.location.hash === '#/raw' ? 'feed' : 'home'
}

export default function App() {
  const [view, setView] = useState<View>(getViewFromHash)

  useEffect(() => {
    const onHashChange = () => setView(getViewFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = (v: View) => {
    window.location.hash = v === 'feed' ? '#/raw' : '#/'
    setView(v)
  }

  if (view === 'feed') return <FeedPage onBack={() => navigate('home')} />
  return <Home onNavigate={navigate} />
}
