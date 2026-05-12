import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

export const getLeaderboard = (mode) =>
  api.get('/leaderboard', { params: { mode } })

export const saveScore = (playerName, mode, score, total) =>
  api.post('/scores', { player_name: playerName, mode, score, total })

export default api
