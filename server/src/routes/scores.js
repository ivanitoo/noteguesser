import { Router } from 'express'
import { getAll, insert } from '../db.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.post('/', authMiddleware, (req, res) => {
  const { mode, score, total } = req.body
  if (!mode || score === undefined || total === undefined) {
    return res.status(400).json({ error: 'mode, score y total requeridos' })
  }
  if (!['piano', 'guitar', 'slider'].includes(mode)) {
    return res.status(400).json({ error: 'Modo inválido' })
  }
  try {
    insert('INSERT INTO scores (user_id, mode, score, total) VALUES (?, ?, ?, ?)', [req.userId, mode, score, total])
    res.status(201).json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar score' })
  }
})

router.get('/history', authMiddleware, (req, res) => {
  try {
    const rows = getAll(
      'SELECT id, mode, score, total, created_at FROM scores WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.userId]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener historial' })
  }
})

export default router
