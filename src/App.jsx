import { useState } from 'react'
import SearchBar from './components/SearchBar'
import AthleteDetail from './components/AthleteDetail'
import AllAthletes from './components/AllAthletes'
import { supabase, isConfigured } from './supabase'

export default function App() {
  const [selectedId, setSelectedId] = useState(null)
  const [view, setView] = useState('search')

  if (!isConfigured) {
    return (
      <div className="app">
        <h1 className="app-title">Tournament Medal Tracker</h1>
        <div className="config-error">
          <h2>Supabase Not Configured</h2>
          <p>Set these environment variables in your Vercel project:</p>
          <code>VITE_SUPABASE_URL</code>
          <code>VITE_SUPABASE_ANON_KEY</code>
          <p>Then redeploy.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <h1 className="app-title">Tournament Medal Tracker</h1>

      <div className="top-actions">
        <SearchBar onSelect={(id) => { setSelectedId(id); setView('search') }} />
        <button className="view-all-btn" onClick={() => setView('all')}>
          View All Athletes
        </button>
      </div>

      {view === 'all' ? (
        <AllAthletes onBack={() => setView('search')} />
      ) : selectedId ? (
        <AthleteDetail
          athleteId={selectedId}
          onBack={() => setSelectedId(null)}
        />
      ) : (
        <div className="welcome">
          <p>Search an athlete above to view or update medal details.</p>
        </div>
      )}
    </div>
  )
}
