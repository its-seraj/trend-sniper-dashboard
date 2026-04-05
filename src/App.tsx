import { useState } from 'react'
import { Home } from './pages/Home'
import { FeedPage } from './pages/FeedPage'

export type View = 'home' | 'feed'

export default function App() {
  const [view, setView] = useState<View>('home')

  if (view === 'feed') return <FeedPage onBack={() => setView('home')} />
  return <Home onNavigate={setView} />
}
