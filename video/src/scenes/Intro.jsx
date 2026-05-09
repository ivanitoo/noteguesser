import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from 'remotion'

const noteSymbols = ['♩', '♪', '♫', '♬']
const FONT = 'system-ui, -apple-system, sans-serif'

export default function Intro() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const titleSpring = spring({ frame, fps, config: { damping: 12, mass: 0.5 } })
  const subtitleOpacity = Math.min(1, (frame - 30) / 15)

  const particles = noteSymbols.map((symbol, i) => {
    const delay = i * 8
    const pFrame = Math.max(0, frame - delay)
    const y = spring({ frame: pFrame, fps, config: { damping: 20, mass: 0.8 } })
    const opacity = Math.min(1, pFrame / 10) * (1 - Math.max(0, (pFrame - 50) / 20))
    const x = 300 + i * 400
    return { symbol, y: 900 - y * 800, x, opacity }
  })

  return (
    <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: 300,
          height: 300,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.08)',
          position: 'absolute',
          opacity: Math.min(1, frame / 30),
        }}
      />

      <h1
        style={{
          color: '#fff',
          fontSize: 80,
          fontWeight: 700,
          fontFamily: FONT,
          transform: `scale(${titleSpring})`,
          opacity: Math.min(1, frame / 20),
          letterSpacing: '-0.03em',
        }}
      >
        ♫ Adivina la Nota
      </h1>

      <p
        style={{
          color: 'rgba(255,255,255,0.4)',
          fontSize: 22,
          fontFamily: FONT,
          opacity: subtitleOpacity,
          marginTop: 20,
          letterSpacing: '0.05em',
        }}
      >
        Entrena tu oído musical
      </p>

      {particles.map((p, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            fontSize: 36,
            color: 'rgba(255,255,255,0.2)',
            opacity: p.opacity,
            fontFamily: FONT,
          }}
        >
          {p.symbol}
        </span>
      ))}
    </AbsoluteFill>
  )
}
