export default function ModeSelector({ mode, onChange }) {
  const modes = [
    { id: 'piano', label: 'Piano', icon: '♫' },
    { id: 'guitar', label: 'Guitarra', icon: '♬' },
    { id: 'slider', label: 'Slider Hz', icon: '〜' },
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
