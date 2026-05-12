import axios from 'axios'

const isProduction = !['localhost', '127.0.0.1'].includes(window.location.hostname)
const API_URL = import.meta.env.VITE_API_URL || (isProduction ? 'https://noteguesser-api.onrender.com' : '')

const api = axios.create({
  baseURL: `${API_URL}/api`,
})

export const getLeaderboard = (mode) =>
  api.get('/leaderboard', { params: { mode } })

export const saveScore = (playerName, mode, score, total) =>
  api.post('/scores', { player_name: playerName, mode, score, total })

export default api
