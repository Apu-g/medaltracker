import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import * as XLSX from 'xlsx'

const AGE_ORDER = ['Under_6', 'Under_8', 'Under_10', 'Under_12', 'Under_14', 'Under_18']

export default function AllAthletes({ onBack }) {
  const [grouped, setGrouped] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('athletes')
      .select('*')
      .order('age_group')
      .order('name')
      .then(({ data }) => {
        if (!data) return
        const g = {}
        for (const a of data) {
          const ag = a.age_group || 'Unknown'
          if (!g[ag]) g[ag] = []
          g[ag].push(a)
        }
        setGrouped(g)
        setLoading(false)
      })
  }, [])

  const exportExcel = () => {
    const wb = XLSX.utils.book_new()
    const sorted = AGE_ORDER.filter((k) => grouped[k])
    const allKeys = [...sorted, ...Object.keys(grouped).filter((k) => !AGE_ORDER.includes(k))]

    for (const age of allKeys) {
      const athletes = grouped[age]
      const rows = []
      const sections = ['poomsae', 'kyorugi', 'both', 'official']
      for (const sec of sections) {
        const filtered = athletes.filter((a) => a.category === sec)
        if (filtered.length === 0) continue
        rows.push({ Athlete: sec.toUpperCase(), Belt: '', DOB: '', 'Medal': '' })
        for (const a of filtered) {
          rows.push({
            Athlete: a.name,
            Belt: a.belt,
            DOB: a.dob,
            'Medal': sec === 'official' ? (a.medal_poomsae || '') : '',
            'Medal-Poomsae': sec !== 'official' ? (a.medal_poomsae || '') : '',
            'Medal-Kyorugi': sec !== 'official' ? (a.medal_kyorugi || '') : '',
          })
        }
        rows.push({})
      }
      const ws = XLSX.utils.json_to_sheet(rows)
      XLSX.utils.book_append_sheet(wb, ws, age)
    }
    XLSX.writeFile(wb, 'athletes_export.xlsx')
  }

  if (loading) return <div className="all-view"><p>Loading...</p></div>

  const sorted = AGE_ORDER.filter((k) => grouped[k])
  const rest = Object.keys(grouped).filter((k) => !AGE_ORDER.includes(k))

  return (
    <div className="all-view">
      <div className="all-header">
        <h2>All Athletes</h2>
        <div>
          <button className="excel-btn" onClick={exportExcel}>Export to Excel</button>
          <button className="back-btn" onClick={onBack}>Back</button>
        </div>
      </div>

      {[...sorted, ...rest].map((age) => (
        <div key={age} className="age-group">
          <h3>{age.replace('_', ' ')}</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Belt</th>
                <th>DOB</th>
                <th>Category</th>
                <th>Medal (Poomsae)</th>
                <th>Medal (Kyorugi)</th>
              </tr>
            </thead>
            <tbody>
              {grouped[age].map((a) => (
                <tr key={a.id}>
                  <td>{a.name}</td>
                  <td>{a.belt}</td>
                  <td>{a.dob}</td>
                  <td>{a.category}</td>
                  <td>{a.medal_poomsae || '-'}</td>
                  <td>{a.medal_kyorugi || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}
