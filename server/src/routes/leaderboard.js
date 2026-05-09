import { Router } from 'express'
import { getAll } from '../db.js'

const router = Router()

router.get('/', (req, res) => {
  try {
    const rows = getAll(`
      SELECT s.mode, s.score, s.total, s.created_at, u.username
      FROM scores s
      JOIN users u ON u.id = s.user_id
      ORDER BY (CAST(s.score AS REAL) / CAST(s.total AS REAL)) DESC, s.score DESC
      LIMIT 20
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener leaderboard' })
  }
})

export default router
