import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from 'remotion'

const MIN_FREQ = 130.81
const MAX_FREQ = 523.25

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const FONT = 'system-ui, -apple-system, sans-serif'

function freqToNote(freq) {
  const midi = Math.round(12 * Math.log2(freq / 440) + 69)
  const oct = Math.floor(midi / 12) - 1
  return `${NOTES[midi % 12]}${oct}`
}

export default function SliderDemo() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const targetHz = 440
  const duration = 45
  const progress = Math.min(1, frame / duration)

  const eased = progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2

  const currentHz = MIN_FREQ + (targetHz - MIN_FREQ) * eased
  const pct = ((currentHz - MIN_FREQ) / (MAX_FREQ - MIN_FREQ)) * 100

  const showLabel = frame > duration - 5

  return (
    <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h2
        style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: 22,
          fontFamily: FONT,
          position: 'absolute',
          top: 80,
          fontWeight: 500,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
        }}
      >
        Modo Slider Hz
      </h2>

      <div style={{ textAlign: 'center', position: 'absolute', top: 180 }}>
        <div
          style={{
            color: showLabel ? '#fff' : 'rgba(255,255,255,0.6)',
            fontSize: 72,
            fontFamily: FONT,
            fontWeight: 300,
            marginBottom: 8,
            letterSpacing: '-0.03em',
          }}
        >
          {freqToNote(currentHz)}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 24, fontFamily: 'SF Mono, Menlo, monospace' }}>
          {currentHz.toFixed(1)} Hz
        </div>
      </div>

      <div style={{ position: 'absolute', top: 400, left: 200, right: 200 }}>
        <div
          style={{
            width: '100%',
            height: 4,
            background: '#222',
            borderRadius: 2,
            position: 'relative',
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: '100%',
              background: '#fff',
              borderRadius: 2,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: `${pct}%`,
              top: -10,
              width: 24,
              height: 24,
              borderRadius: '50%',
              border: '2px solid #fff',
              background: '#000',
              transform: 'translateX(-50%)',
              boxShadow: '0 0 20px rgba(255,255,255,0.15)',
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 12,
            color: 'rgba(255,255,255,0.2)',
            fontSize: 13,
            fontFamily: 'SF Mono, Menlo, monospace',
          }}
        >
          <span>130 Hz</span>
          <span>262 Hz</span>
          <span>392 Hz</span>
          <span>523 Hz</span>
        </div>
      </div>

      <p
        style={{
          position: 'absolute',
          bottom: 100,
          color: 'rgba(255,255,255,0.25)',
          fontSize: 15,
          fontFamily: FONT,
          letterSpacing: '0.05em',
        }}
      >
        Ajusta el slider hasta encontrar la frecuencia exacta
      </p>
    </AbsoluteFill>
  )
}
