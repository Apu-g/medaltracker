import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export default function AthleteDetail({ athleteId, onBack }) {
  const [athlete, setAthlete] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!athleteId) return
    supabase
      .from('athletes')
      .select('*')
      .eq('id', athleteId)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setMessage('Error fetching athlete: ' + error.message)
        } else {
          setAthlete(data)
        }
      })
  }, [athleteId])

  if (!athlete) {
    return <div className="detail-panel"><p>Loading...</p></div>
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    const { error } = await supabase
      .from('athletes')
      .update({
        medal_poomsae: athlete.medal_poomsae || null,
        medal_kyorugi: athlete.medal_kyorugi || null,
        medal_freestyle: athlete.medal_freestyle || null,
      })
      .eq('id', athlete.id)

    if (error) {
      setMessage('Error saving: ' + error.message)
    } else {
      setMessage('Saved successfully!')
    }
    setSaving(false)
  }

  return (
    <div className="detail-panel">
      <div className="detail-header">
        <h2>{athlete.name}</h2>
        <button className="back-btn" onClick={onBack}>Back</button>
      </div>

      <div className="detail-grid">
        <div><strong>Belt:</strong> {athlete.belt}</div>
        <div><strong>DOB:</strong> {athlete.dob}</div>
        <div><strong>Age Group:</strong> {athlete.age_group?.replace('_', ' ')}</div>
        <div><strong>Category:</strong> {athlete.category}</div>
      </div>

      <div className="medal-fields">
        {athlete.category === 'official' && (
          <>
            <div className="field">
              <label>Medal (Poomsae)</label>
              <select
                value={athlete.medal_poomsae || ''}
                onChange={(e) =>
                  setAthlete({ ...athlete, medal_poomsae: e.target.value || null })
                }
              >
                <option value="">— Select —</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Bronze">Bronze</option>
                <option value="Participation">Participation</option>
              </select>
            </div>
            <div className="field">
              <label>Medal (Kyorugi)</label>
              <select
                value={athlete.medal_kyorugi || ''}
                onChange={(e) =>
                  setAthlete({ ...athlete, medal_kyorugi: e.target.value || null })
                }
              >
                <option value="">— Select —</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Bronze">Bronze</option>
                <option value="Participation">Participation</option>
              </select>
            </div>
            <div className="field">
              <label>Medal (Freestyle)</label>
              <select
                value={athlete.medal_freestyle || ''}
                onChange={(e) =>
                  setAthlete({ ...athlete, medal_freestyle: e.target.value || null })
                }
              >
                <option value="">— Select —</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Bronze">Bronze</option>
                <option value="Participation">Participation</option>
              </select>
            </div>
          </>
        )}
        {(athlete.category === 'poomsae' || athlete.category === 'both') && (
          <div className="field">
            <label>Medal (Poomsae)</label>
            <select
              value={athlete.medal_poomsae || ''}
              onChange={(e) =>
                setAthlete({ ...athlete, medal_poomsae: e.target.value || null })
              }
            >
              <option value="">— Select —</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Bronze">Bronze</option>
              <option value="Participation">Participation</option>
            </select>
          </div>
        )}
        {(athlete.category === 'kyorugi' || athlete.category === 'both') && (
          <div className="field">
            <label>Medal (Kyorugi)</label>
            <select
              value={athlete.medal_kyorugi || ''}
              onChange={(e) =>
                setAthlete({ ...athlete, medal_kyorugi: e.target.value || null })
              }
            >
              <option value="">— Select —</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Bronze">Bronze</option>
              <option value="Participation">Participation</option>
            </select>
          </div>
        )}
      </div>

      <button className="save-btn" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save to Database'}
      </button>
      {message && <p className="message">{message}</p>}
    </div>
  )
}
