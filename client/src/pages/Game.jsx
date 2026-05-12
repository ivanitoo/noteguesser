import GameBoard from '../components/GameBoard.jsx'
import { useLocale } from '../context/LocaleContext.jsx'

export default function Game() {
  const { t } = useLocale()

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold tracking-tight mb-8 text-center">{t('game.pageTitle')}</h2>
      <GameBoard />
    </div>
  )
}
