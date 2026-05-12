import { useLocale } from '../context/LocaleContext.jsx'

export default function NoteDisplay({ noteName, feedback, accuracy, targetFreq }) {
  const { t } = useLocale()
  if (!feedback) return null

  const colors = {
    correct: 'text-green-400 border-green-500/30',
    wrong: 'text-red-400 border-red-500/30',
  }

  const icons = {
    correct: '✅',
    wrong: '❌',
  }

  const freqText = targetFreq !== null ? `${targetFreq.toFixed(1)} Hz` : null
  const nearestNote = noteName
    ? t('feedback.itwas', { note: `${noteName}${freqText ? ` · ${freqText}` : ''}` })
    : null
  const accText = accuracy !== null ? t('feedback.accuracy', { accuracy }) : null

  return (
    <div className={`inline-flex items-center gap-3 px-5 py-3 border rounded-lg ${colors[feedback] || ''}`}>
      <span className="text-lg">{icons[feedback]}</span>
      <div>
        <div className="font-medium">{t(`feedback.${feedback}`)}</div>
        <div className="text-sm opacity-70 leading-tight">
          {accuracy !== null && <div>{accText}</div>}
          {noteName && <div>{nearestNote}</div>}
        </div>
      </div>
    </div>
  )
}
