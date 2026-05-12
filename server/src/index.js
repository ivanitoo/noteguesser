import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import scoresRoutes from './routes/scores.js'
import leaderboardRoutes from './routes/leaderboard.js'

const app = express()
const PORT = process.env.PORT || 3001

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(cors())
app.use(express.json({ limit: '10kb' }))
app.use(limiter)

app.use('/api/scores', scoresRoutes)
app.use('/api/leaderboard', leaderboardRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
