import { useLocale } from '../context/LocaleContext.jsx'

export default function ModeSelector({ mode, onChange }) {
  const { t } = useLocale()
  const modes = [
    { id: 'piano', label: t('mode.piano'), icon: '♫' },
    { id: 'guitar', label: t('mode.guitar'), icon: '♬' },
    { id: 'slider', label: t('mode.slider'), icon: '〜' },
  ]

  return (
    <div className="flex gap-3">
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          className={`line-art-btn px-5 py-2 text-sm ${mode === m.id ? 'active' : ''}`}
        >
          {m.icon} {m.label}
        </button>
      ))}
    </div>
  )
}
