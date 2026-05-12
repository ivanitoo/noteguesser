import { useState, useEffect, useCallback } from 'react'
import { getLeaderboard } from '../services/api.js'
import { supabase } from '../services/supabase.js'

const MODES = [
  { id: 'piano', label: 'Piano' },
  { id: 'guitar', label: 'Guitarra' },
  { id: 'slider', label: 'Slider Hz' },
]

export default function Leaderboard() {
  const [mode, setMode] = useState('piano')
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchLeaderboard = useCallback(async (m) => {
    setLoading(true)
    try {
      const res = await getLeaderboard(m)
      setEntries(res.data)
    } catch {
      setEntries([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLeaderboard(mode)
  }, [mode, fetchLeaderboard])

  useEffect(() => {
    const channel = supabase
      .channel('leaderboard-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'scores' }, () => {
        fetchLeaderboard(mode)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [mode, fetchLeaderboard])

  const accuracy = (score, total) => total > 0 ? Math.round((score / total) * 100) : 0

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold tracking-tight mb-8 text-center">Ranking</h2>

      <div className="flex gap-3 justify-center mb-8">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`line-art-btn px-5 py-2 text-sm ${mode === m.id ? 'active' : ''}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-white/40">Cargando...</p>
      ) : entries.length === 0 ? (
        <p className="text-center text-white/40">Todavía no hay puntajes esta semana. ¡Sé el primero!</p>
      ) : (
        <div className="border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th className="text-left px-4 py-3 font-medium">#</th>
                <th className="text-left px-4 py-3 font-medium">Jugador</th>
                <th className="text-right px-4 py-3 font-medium">Puntaje</th>
                <th className="text-right px-4 py-3 font-medium">Precisión</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                  <td className="px-4 py-3 text-white/40">{i + 1}</td>
                  <td className="px-4 py-3">{entry.player_name}</td>
                  <td className="px-4 py-3 text-right">{entry.score}/{entry.total}</td>
                  <td className="px-4 py-3 text-right text-green-400">{accuracy(entry.score, entry.total)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
