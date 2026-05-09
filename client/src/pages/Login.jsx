import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { login as apiLogin } from '../services/api.js'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await apiLogin(username, password)
      signIn(res.data.token, res.data.user)
      navigate('/game')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión')
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold tracking-tight mb-8 text-center">Ingresar</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-transparent border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/30 
                     focus:outline-none focus:border-white/50 transition-colors"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-transparent border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/30 
                     focus:outline-none focus:border-white/50 transition-colors"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button type="submit" className="line-art-btn px-8 py-2 text-sm w-full">
          Ingresar
        </button>
        <p className="text-center text-sm text-white/40">
          ¿No tenés cuenta? <Link to="/register" className="text-white/70 hover:text-white">Registrate</Link>
        </p>
      </form>
    </div>
  )
}
