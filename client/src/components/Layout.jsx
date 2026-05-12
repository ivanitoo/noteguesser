import { Outlet, Link, useLocation } from 'react-router-dom'
import VolumeControl from './VolumeControl.jsx'
import BackgroundMusic from './BackgroundMusic.jsx'
import LanguageSwitcher from './LanguageSwitcher.jsx'
import { useLocale } from '../context/LocaleContext.jsx'

export default function Layout() {
  const location = useLocation()
  const { t } = useLocale()

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
              {t('app.title')}
            </Link>
            <VolumeControl />
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link to="/game" className={linkClass('/game')}>{t('nav.play')}</Link>
            <Link to="/leaderboard" className={linkClass('/leaderboard')}>{t('nav.ranking')}</Link>
            <LanguageSwitcher />
          </div>
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
