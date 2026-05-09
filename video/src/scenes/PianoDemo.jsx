import { AbsoluteFill, useCurrentFrame } from 'remotion'

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const WHITE_KEYS = []
for (let m = 48; m <= 60; m++) {
  const note = NOTES[m % 12]
  if (!note.includes('#')) WHITE_KEYS.push(m)
}

const BLACK_KEYS = []
for (let m = 48; m <= 60; m++) {
  const note = NOTES[m % 12]
  if (note.includes('#')) BLACK_KEYS.push(m)
}

const NOTE_SEQ = [
  { midi: 48, frame: 5 },
  { midi: 52, frame: 20 },
  { midi: 55, frame: 35 },
]

export default function PianoDemo() {
  const frame = useCurrentFrame()

  const label = (midi) => {
    const note = NOTES[midi % 12]
    const oct = Math.floor(midi / 12) - 1
    return `${note}${oct}`
  }

  const isNoteActive = (midi) => {
    const seq = NOTE_SEQ.find((n) => n.midi === midi)
    if (!seq) return false
    const localFrame = frame - seq.frame
    return localFrame >= 0 && localFrame <= 12
  }

  const isNoteCorrect = (midi) => {
    const seq = NOTE_SEQ.find((n) => n.midi === midi)
    if (!seq) return false
    const localFrame = frame - seq.frame
    return localFrame >= 5 && localFrame <= 12
  }

  const keyW = 80
  const keyH = 200
  const blackKeyW = 48
  const blackKeyH = 120
  const totalW = WHITE_KEYS.length * keyW
  const startX = (1920 - totalW) / 2
  const pianoY = 280

  const getBlackKeyX = (midi) => {
    const prevWhite = midi - 1
    const whiteIdx = WHITE_KEYS.indexOf(prevWhite)
    return (whiteIdx + 1) * keyW - blackKeyW / 2
  }

  const activeNoteLabel = (() => {
    const activeNote = NOTE_SEQ.find((n) => isNoteCorrect(n.midi))
    if (!activeNote) return null
    return {
      text: label(activeNote.midi),
      opacity: Math.min(1, (frame - activeNote.frame - 5) / 5),
    }
  })()

  return (
    <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h2
        style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: 22,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'absolute',
          top: 80,
          fontWeight: 500,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
        }}
      >
        Modo Piano
      </h2>

      {activeNoteLabel && (
        <div
          style={{
            position: 'absolute',
            top: 150,
            color: '#fff',
            fontSize: 56,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: 700,
            opacity: activeNoteLabel.opacity,
            letterSpacing: '-0.02em',
          }}
        >
          {activeNoteLabel.text}
        </div>
      )}

      <svg
        width={totalW}
        height={keyH}
        style={{ position: 'absolute', top: pianoY, left: startX }}
        viewBox={`0 0 ${totalW} ${keyH}`}
      >
        {WHITE_KEYS.map((midi, i) => {
          const active = isNoteActive(midi)
          const correct = isNoteCorrect(midi)
          const fill = active
            ? correct
              ? 'rgba(34,197,94,0.25)'
              : 'rgba(255,255,255,0.12)'
            : 'transparent'

          return (
            <g key={midi}>
              <rect
                x={i * keyW}
                y={0}
                width={keyW}
                height={keyH}
                fill={fill}
                stroke="rgba(255,255,255,0.9)"
                strokeWidth={1.5}
                rx={4}
              />
              <rect
                x={i * keyW + 1}
                y={keyH - 4}
                width={keyW - 2}
                height={4}
                fill="rgba(255,255,255,0.3)"
                rx={2}
              />
              <text
                x={i * keyW + keyW / 2}
                y={keyH - 16}
                textAnchor="middle"
                fill="rgba(255,255,255,0.3)"
                fontSize={13}
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {label(midi)}
              </text>
              {active && correct && (
                <rect
                  x={i * keyW}
                  y={0}
                  width={keyW}
                  height={keyH}
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth={2}
                  rx={4}
                />
              )}
            </g>
          )
        })}

        {BLACK_KEYS.map((midi) => {
          const active = isNoteActive(midi)
          const correct = isNoteCorrect(midi)
          const x = getBlackKeyX(midi)
          const fill = active
            ? correct
              ? 'rgba(34,197,94,0.6)'
              : 'rgba(255,255,255,0.35)'
            : '#111'

          return (
            <rect
              key={midi}
              x={x}
              y={0}
              width={blackKeyW}
              height={blackKeyH}
              fill={fill}
              stroke={active && correct ? '#22c55e' : 'rgba(255,255,255,0.7)'}
              strokeWidth={active && correct ? 2 : 1.5}
              rx={3}
            />
          )
        })}
      </svg>

      <p
        style={{
          position: 'absolute',
          bottom: 100,
          color: 'rgba(255,255,255,0.25)',
          fontSize: 15,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '0.05em',
        }}
      >
        Escucha la nota → toca la tecla correcta
      </p>
    </AbsoluteFill>
  )
}
