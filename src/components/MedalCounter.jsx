import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

const MEDAL_COLUMNS = ['medal_poomsae', 'medal_kyorugi', 'medal_freestyle']
const TYPES = ['Gold', 'Silver', 'Bronze']

export default function MedalCounter() {
  const [counts, setCounts] = useState({ Gold: 0, Silver: 0, Bronze: 0 })

  useEffect(() => {
    if (!supabase) return
    let active = true

    const load = async () => {
      const { data } = await supabase.from('athletes').select(MEDAL_COLUMNS.join(','))
      if (!active || !data) return
      const c = { Gold: 0, Silver: 0, Bronze: 0 }
      for (const a of data) {
        for (const col of MEDAL_COLUMNS) {
          const m = a[col]
          if (TYPES.includes(m)) c[m] += 1
        }
      }
      setCounts(c)
    }

    load()
    const interval = setInterval(load, 5000)

    const channel = supabase
      .channel('medal-counter')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'athletes' }, () => load())
      .subscribe()

    return () => {
      active = false
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="medal-counter">
      <div className="medal-stat medal-gold">
        <span className="medal-dot"></span>
        <span className="medal-label">Gold</span>
        <span className="medal-count">{counts.Gold}</span>
      </div>
      <div className="medal-stat medal-silver">
        <span className="medal-dot"></span>
        <span className="medal-label">Silver</span>
        <span className="medal-count">{counts.Silver}</span>
      </div>
      <div className="medal-stat medal-bronze">
        <span className="medal-dot"></span>
        <span className="medal-label">Bronze</span>
        <span className="medal-count">{counts.Bronze}</span>
      </div>
    </div>
  )
}
