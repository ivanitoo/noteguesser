import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import scoresRoutes from './routes/scores.js'
import leaderboardRoutes from './routes/leaderboard.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/scores', scoresRoutes)
app.use('/api/leaderboard', leaderboardRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
