import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import AthleteDetail from './components/AthleteDetail'
import AllAthletes from './components/AllAthletes'
import { supabase } from './supabase'

export default function App() {
  const [selectedId, setSelectedId] = useState(null)
  const [view, setView] = useState('search') // 'search' | 'all'

  useEffect(() => {
    checkAndSeed()
  }, [])

  const checkAndSeed = async () => {
    const { count, error } = await supabase
      .from('athletes')
      .select('*', { count: 'exact', head: true })
    if (error) {
      console.error('DB check error:', error.message)
      return
    }
    if (count === 0) {
      console.log('No data found. Please run the seed script first.')
    }
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
