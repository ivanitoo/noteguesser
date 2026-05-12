import { Router } from 'express'
import { supabase } from '../db.js'

const router = Router()

const VALID_MODES = ['piano', 'guitar', 'slider']

function getWeekStart() {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(now.setDate(diff))
  monday.setHours(0, 0, 0, 0)
  return monday.toISOString()
}

router.get('/', async (req, res) => {
  const mode = req.query.mode

  if (!mode || !VALID_MODES.includes(mode)) {
    return res.status(400).json({ error: 'Modo inválido. Usa ?mode=piano|guitar|slider' })
  }

  try {
    const { data, error } = await supabase
      .from('scores')
      .select('player_name, score, total')
      .eq('mode', mode)
      .gte('created_at', getWeekStart())

    if (error) throw error

    const agg = {}
    for (const row of data || []) {
      if (!agg[row.player_name]) {
        agg[row.player_name] = { player_name: row.player_name, score: 0, total: 0 }
      }
      agg[row.player_name].score += row.score
      agg[row.player_name].total += row.total
    }

    const sorted = Object.values(agg)
      .map((e) => ({ ...e, ratio: e.total > 0 ? e.score / e.total : 0 }))
      .sort((a, b) => b.ratio - a.ratio || b.score - a.score)
      .slice(0, 10)

    res.json(sorted)
  } catch (err) {
    console.error('Error al obtener leaderboard:', err)
    res.status(500).json({ error: 'Error al obtener leaderboard' })
  }
})

export default router
