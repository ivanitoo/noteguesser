import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from 'remotion'

const FONT = 'system-ui, -apple-system, sans-serif'

export default function Outro() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, mass: 0.6 } })
  const subtitleOpacity = Math.min(1, (frame - 20) / 10)
  const ctaOpacity = Math.min(1, (frame - 30) / 10)

  return (
    <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          position: 'absolute',
          top: 150,
          fontSize: 120,
          color: 'rgba(255,255,255,0.06)',
          fontFamily: FONT,
          fontWeight: 900,
        }}
      >
        ♫
      </div>

      <div style={{ textAlign: 'center' }}>
        <h1
          style={{
            color: '#fff',
            fontSize: 64,
            fontWeight: 700,
            fontFamily: FONT,
            transform: `scale(${titleSpring})`,
            opacity: Math.min(1, frame / 10),
            letterSpacing: '-0.03em',
          }}
        >
          ¿Adivinas la nota?
        </h1>

        <p
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: 22,
            fontFamily: FONT,
            opacity: subtitleOpacity,
            marginTop: 16,
            letterSpacing: '0.02em',
          }}
        >
          Pon a prueba tu oído musical
        </p>
      </div>

      <div
        style={{
          opacity: ctaOpacity,
          marginTop: 60,
          padding: '14px 48px',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: 10,
          color: '#fff',
          fontSize: 20,
          fontFamily: FONT,
          fontWeight: 500,
          letterSpacing: '0.05em',
          transform: `scale(${frame > 40 ? 1 + Math.sin((frame - 40) * 0.08) * 0.04 : 1})`,
          boxShadow: frame > 40
            ? `0 0 ${20 + Math.sin((frame - 40) * 0.08) * 10}px rgba(255,255,255,${0.08 + Math.sin((frame - 40) * 0.08) * 0.04})`
            : 'none',
        }}
      >
        Jugar ahora →
      </div>

      <p
        style={{
          position: 'absolute',
          bottom: 60,
          color: 'rgba(255,255,255,0.15)',
          fontSize: 13,
          fontFamily: FONT,
          letterSpacing: '0.1em',
        }}
      >
        adivinalanota.app
      </p>
    </AbsoluteFill>
  )
}
