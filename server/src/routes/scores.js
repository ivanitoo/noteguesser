import { Router } from 'express'
import { supabase } from '../db.js'

const router = Router()

router.post('/', async (req, res) => {
  const { player_name, mode, score, total } = req.body

  if (!player_name || typeof player_name !== 'string' || player_name.trim().length === 0) {
    return res.status(400).json({ error: 'player_name requerido' })
  }
  if (player_name.trim().length > 30) {
    return res.status(400).json({ error: 'player_name demasiado largo (máx 30)' })
  }
  if (!mode || !['piano', 'guitar', 'slider'].includes(mode)) {
    return res.status(400).json({ error: 'Modo inválido' })
  }
  if (typeof score !== 'number' || typeof total !== 'number' || total <= 0 || score < 0) {
    return res.status(400).json({ error: 'score y total deben ser números válidos' })
  }

  try {
    const { error } = await supabase.from('scores').insert({
      player_name: player_name.trim(),
      mode,
      score,
      total,
    })
    if (error) throw error
    res.status(201).json({ success: true })
  } catch (err) {
    console.error('Error al guardar score:', err)
    res.status(500).json({ error: 'Error al guardar score' })
  }
})

export default router
