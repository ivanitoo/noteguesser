import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const register = (username, password) =>
  api.post('/auth/register', { username, password })

export const login = (username, password) =>
  api.post('/auth/login', { username, password })

export const getLeaderboard = () =>
  api.get('/leaderboard')

export const saveScore = (mode, score, total) =>
  api.post('/scores', { mode, score, total })

export const getHistory = () =>
  api.get('/scores/history')

export default api
