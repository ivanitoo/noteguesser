import { useState, useEffect } from 'react'
import { getLeaderboard } from '../services/api.js'

const MODE_LABELS = { piano: 'Piano', guitar: 'Guitarra', slider: 'Slider Hz' }

export default function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLeaderboard()
      .then((res) => setEntries(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const accuracy = (score, total) => total > 0 ? Math.round((score / total) * 100) : 0

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold tracking-tight mb-8 text-center">Ranking</h2>

      {loading ? (
        <p className="text-center text-white/40">Cargando...</p>
      ) : entries.length === 0 ? (
        <p className="text-center text-white/40">Todavía no hay puntajes. ¡Sé el primero!</p>
      ) : (
        <div className="border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th className="text-left px-4 py-3 font-medium">#</th>
                <th className="text-left px-4 py-3 font-medium">Usuario</th>
                <th className="text-left px-4 py-3 font-medium">Modo</th>
                <th className="text-right px-4 py-3 font-medium">Puntaje</th>
                <th className="text-right px-4 py-3 font-medium">Precisión</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                  <td className="px-4 py-3 text-white/40">{i + 1}</td>
                  <td className="px-4 py-3">{entry.username}</td>
                  <td className="px-4 py-3 text-white/60">{MODE_LABELS[entry.mode] || entry.mode}</td>
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
