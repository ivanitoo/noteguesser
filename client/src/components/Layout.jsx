import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import VolumeControl from './VolumeControl.jsx'
import BackgroundMusic from './BackgroundMusic.jsx'

export default function Layout() {
  const { user, signOut } = useAuth()
  const location = useLocation()

  const linkClass = (path) =>
    `transition-all duration-200 ${
      location.pathname === path
        ? 'text-white'
        : 'text-white/40 hover:text-white/70'
    }`

  return (
    <div className="min-h-screen text-white flex flex-col">
      <BackgroundMusic />
      <header className="sticky top-0 z-50 border-b border-white/[0.04] backdrop-blur-xl bg-black/50">
        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] via-transparent to-white/[0.02] pointer-events-none" />
        <nav className="relative max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xl font-bold tracking-tight text-white/90 hover:text-white transition-colors duration-200">
              ♫ Adivina la Nota
            </Link>
            <VolumeControl />
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link to="/game" className={linkClass('/game')}>Jugar</Link>
            <Link to="/leaderboard" className={linkClass('/leaderboard')}>Ranking</Link>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-white/40 text-sm">{user.username}</span>
                <button
                  onClick={signOut}
                  className="text-white/30 hover:text-white/60 transition-all duration-200 text-sm"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link to="/login" className={linkClass('/login')}>Ingresar</Link>
            )}
          </div>
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
