import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabase'

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [allNames, setAllNames] = useState([])
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    if (!supabase) return
    supabase
      .from('athletes')
      .select('id, name, category, age_group')
      .then(({ data }) => {
        if (data) setAllNames(data)
      })
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([])
      return
    }
    const q = query.toLowerCase().trim()
    const matches = allNames.filter((a) =>
      a.name.toLowerCase().includes(q)
    )
    setSuggestions(matches.slice(0, 10))
    setOpen(matches.length > 0)
  }, [query, allNames])

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="search-wrapper" ref={ref}>
      <div className="search-input-row">
        <input
          type="text"
          placeholder="Search athlete name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
        />
        <button onClick={() => { setQuery(''); setSuggestions([]) }}>Clear</button>
      </div>
      {open && (
        <ul className="suggestions">
          {suggestions.map((a) => (
            <li
              key={a.id}
              onClick={() => {
                setQuery(a.name)
                setOpen(false)
                onSelect(a.id)
              }}
            >
              {a.name}
              <span className="suggestion-meta">
                {a.category} · {a.age_group?.replace('_', ' ')}
              </span>
            </li>
          ))}
          {suggestions.length === 0 && (
            <li className="no-match">No matches</li>
          )}
        </ul>
      )}
    </div>
  )
}
