import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { getOne, insert } from '../db.js'
import { generateToken } from '../middleware/auth.js'

const router = Router()

router.post('/register', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' })
  }
  if (username.length < 3) {
    return res.status(400).json({ error: 'Usuario debe tener al menos 3 caracteres' })
  }
  if (password.length < 4) {
    return res.status(400).json({ error: 'Contraseña debe tener al menos 4 caracteres' })
  }
  try {
    const existing = getOne('SELECT id FROM users WHERE username = ?', [username])
    if (existing) {
      return res.status(409).json({ error: 'Usuario ya existe' })
    }
    const password_hash = bcrypt.hashSync(password, 10)
    const id = insert('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, password_hash])
    const token = generateToken(id)
    res.status(201).json({ token, user: { id, username } })
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar' })
  }
})

router.post('/login', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' })
  }
  try {
    const user = getOne('SELECT * FROM users WHERE username = ?', [username])
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }
    const token = generateToken(user.id)
    res.json({ token, user: { id: user.id, username: user.username } })
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión' })
  }
})

export default router
