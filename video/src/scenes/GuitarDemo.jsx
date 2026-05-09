import { AbsoluteFill, useCurrentFrame } from 'remotion'

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const TUNING = [
  { note: 'E2', midi: 40 },
  { note: 'A2', midi: 45 },
  { note: 'D3', midi: 50 },
  { note: 'G3', midi: 55 },
  { note: 'B3', midi: 59 },
  { note: 'E4', midi: 64 },
]

const FRETS = 12

const TARGET_STRING = 5
const TARGET_FRET = 0

const FONT = 'system-ui, -apple-system, sans-serif'

export default function GuitarDemo() {
  const frame = useCurrentFrame()
  const showNote = frame > 15 && frame < 50
  const circleOpacity = Math.min(1, (frame - 15) / 8)

  const svgW = 1000
  const svgH = 500
  const marginL = 120
  const marginR = 40
  const stringGap = 50
  const startY = 100
  const fretGap = (svgW - marginL - marginR) / FRETS
  const targetX = marginL - fretGap / 2

  return (
    <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h2
        style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: 22,
          fontFamily: FONT,
          position: 'absolute',
          top: 40,
          fontWeight: 500,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
        }}
      >
        Modo Guitarra
      </h2>

      <svg viewBox={`0 0 ${svgW} ${svgH}`} width={svgW} height={svgH} style={{ position: 'absolute', top: 90 }}>
        <rect
          x={marginL - 10}
          y={startY - 15}
          width={FRETS * fretGap + 20}
          height={5 * stringGap + 30}
          fill="rgba(255,255,255,0.02)"
          rx={6}
        />

        <line
          x1={marginL} y1={startY - 12}
          x2={marginL} y2={startY + 5 * stringGap + 12}
          stroke="#fff" strokeWidth={4}
        />

        {Array.from({ length: FRETS + 1 }).map((_, i) => (
          <line
            key={i}
            x1={marginL + i * fretGap}
            y1={startY - 12}
            x2={marginL + i * fretGap}
            y2={startY + 5 * stringGap + 12}
            stroke={i === 0 ? '#fff' : i === FRETS ? '#fff' : '#444'}
            strokeWidth={i === 0 ? 4 : i === FRETS ? 2 : 1}
          />
        ))}

        {[1, 3, 5, 7, 9, 12].map((f) => (
          <text
            key={f}
            x={marginL + (f - 0.5) * fretGap}
            y={startY + 5 * stringGap + 42}
            textAnchor="middle"
            fill="rgba(255,255,255,0.2)"
            fontSize={15}
            fontFamily={FONT}
          >
            {f}
          </text>
        ))}

        {TUNING.map((_, s) => (
          <line
            key={s}
            x1={marginL}
            y1={startY + s * stringGap}
            x2={marginL + FRETS * fretGap}
            y2={startY + s * stringGap}
            stroke="#fff"
            strokeWidth={2.5 - s * 0.25}
            opacity={0.85}
          />
        ))}

        {[3, 5, 7, 9].map((f) => (
          <circle
            key={f}
            cx={marginL + (f - 0.5) * fretGap}
            cy={startY + 2.5 * stringGap}
            r={6}
            fill="rgba(255,255,255,0.15)"
          />
        ))}
        <circle
          cx={marginL + 11.5 * fretGap}
          cy={startY + 1.5 * stringGap}
          r={6}
          fill="rgba(255,255,255,0.15)"
        />
        <circle
          cx={marginL + 11.5 * fretGap}
          cy={startY + 3.5 * stringGap}
          r={6}
          fill="rgba(255,255,255,0.15)"
        />

        {TUNING.map((t, s) => (
          <text
            key={s}
            x={marginL - 40}
            y={startY + s * stringGap + 6}
            textAnchor="end"
            fill="rgba(255,255,255,0.35)"
            fontSize={15}
            fontFamily={FONT}
            fontWeight={600}
          >
            {t.note}
          </text>
        ))}

        {showNote && (
          <>
            <circle
              cx={targetX}
              cy={startY + TARGET_STRING * stringGap}
              r={22}
              fill="none"
              stroke="#22c55e"
              strokeWidth={3}
              opacity={circleOpacity}
            />
            <circle
              cx={targetX}
              cy={startY + TARGET_STRING * stringGap}
              r={6}
              fill="#22c55e"
              opacity={circleOpacity * 0.6}
            />
          </>
        )}
      </svg>

      {showNote && (
        <div
          style={{
            position: 'absolute',
            top: 610,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#22c55e',
              opacity: circleOpacity,
            }}
          />
          <span
            style={{
              color: '#22c55e',
              fontSize: 36,
              fontFamily: FONT,
              fontWeight: 600,
              letterSpacing: '-0.02em',
            }}
          >
            E4
          </span>
          <span
            style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: 20,
              fontFamily: FONT,
              fontWeight: 400,
            }}
          >
            Primera cuerda al aire
          </span>
        </div>
      )}
    </AbsoluteFill>
  )
}
