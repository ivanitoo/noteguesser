import { useLocale } from '../context/LocaleContext.jsx'

export default function ScoreBoard({ score, total, streak }) {
  const { t } = useLocale()
  const pct = total > 0 ? Math.round((score / total) * 100) : 0

  return (
    <div className="flex items-center gap-8 text-sm font-mono">
      <div>
        <span className="text-white/40">{t('score.label')} </span>
        <span className="text-white">{score}/{total}</span>
      </div>
      <div>
        <span className="text-white/40">{t('score.hits')} </span>
        <span className="text-green-400">{pct}%</span>
      </div>
      {streak > 1 && (
        <div>
          <span className="text-white/40">{t('score.streak')} </span>
          <span className="text-yellow-400">{streak}🔥</span>
        </div>
      )}
    </div>
  )
}
