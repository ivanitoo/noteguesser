import { useState } from 'react'
import { useLocale } from '../context/LocaleContext.jsx'
import { saveScore } from '../services/api.js'

export default function GameOverModal({ score, total, streak, mode, onRestart }) {
  const { t } = useLocale()
  const [name, setName] = useState(localStorage.getItem('noteguesser_player_name') || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const pct = total > 0 ? Math.round((score / total) * 100) : 0

  const handleSubmit = async () => {
    const trimmed = name.trim()
    if (trimmed.length < 2) return
    setSaving(true)
    try {
      localStorage.setItem('noteguesser_player_name', trimmed)
      await saveScore(trimmed, mode, score, total)
      setSaved(true)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="border border-white/20 rounded-xl p-8 w-full max-w-sm mx-4 bg-[#0a0a0f] text-center">
        <h2 className="text-xl font-medium mb-2">{t('gameover.title')}</h2>

        <div className="flex justify-center gap-4 my-6 text-sm font-mono">
          <div><span className="text-white/40">{t('score.label')} </span><span className="text-white">{score}/{total}</span></div>
          <div><span className="text-white/40">{t('score.hits')} </span><span className="text-green-400">{pct}%</span></div>
          {streak > 1 && <div><span className="text-white/40">{t('score.streak')} </span><span className="text-yellow-400">{streak}</span></div>}
        </div>

        {!saved ? (
          <>
            <p className="text-sm text-white/40 mb-4">{t('gameover.namePrompt')}</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('name.placeholder')}
              maxLength={30}
              autoFocus
              className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-white/50 transition-colors mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={name.trim().length < 2 || saving}
                className="flex-1 line-art-btn px-4 py-2.5 text-sm disabled:opacity-30"
              >
                {saving ? t('gameover.saving') : t('gameover.submit')}
              </button>
              <button onClick={onRestart} className="flex-1 line-art-btn px-4 py-2.5 text-sm">
                {t('gameover.skip')}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-green-400 text-sm mb-6">{t('gameover.saved')}</p>
            <button onClick={onRestart} className="line-art-btn px-8 py-2.5 text-sm">
              {t('gameover.playAgain')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
