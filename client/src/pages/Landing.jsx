import { useRef, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Guitar } from 'lucide-react'

export default function Landing() {
  const videoRef = useRef(null)
  const [showCta, setShowCta] = useState(false)

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video) return
    const t = video.currentTime
    setShowCta(t >= 12.3 && t <= 16.3)
  }

  const wavePath = useMemo(() => {
    const w = 1440, h = 300, c = h / 2
    const pts = []
    for (let x = 0; x <= w; x += 2) {
      const y = c + Math.sin(x * 0.025) * 80 + Math.sin(x * 0.06) * 30 + Math.sin(x * 0.012) * 50
      pts.push(`${x},${y}`)
    }
    return `M${pts.join(' L')}`
  }, [])

  return (
    <div className="relative flex flex-col items-center px-4 py-16 text-center overflow-hidden">
      {/* Deep navy gradient — smooth multi-stop */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060a1a] via-[#0a0f2a] via-[#080c22] via-[#040816] to-black pointer-events-none select-none" />
      {/* Navy blue glows */}
      <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-blue-900/[0.05] rounded-full blur-3xl pointer-events-none select-none" />
      <div className="absolute bottom-[20%] right-[-5%] w-[500px] h-[500px] bg-blue-800/[0.03] rounded-full blur-3xl pointer-events-none select-none" />
      {/* Navy waveform */}
      <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid meet" opacity="0.1">
          <defs>
            <linearGradient id="waveNavy" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0" />
              <stop offset="30%" stopColor="#1e40af" />
              <stop offset="70%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${wavePath}`} fill="none" stroke="url(#waveNavy)" strokeWidth="2" transform="translate(0, 240)" />
          <path d={`${wavePath}`} fill="none" stroke="url(#waveNavy)" strokeWidth="4" transform="translate(0, 270)" opacity="0.5" />
          <path d={`${wavePath}`} fill="none" stroke="url(#waveNavy)" strokeWidth="1.5" transform="translate(0, 310)" opacity="0.7" />
          <path d={`${wavePath}`} fill="none" stroke="url(#waveNavy)" strokeWidth="6" transform="translate(0, 350)" opacity="0.15" />
        </svg>
      </div>
      {/* Navy dot grid */}
      <div
        className="absolute inset-0 pointer-events-none select-none opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.2) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="relative z-10 flex flex-col items-center">

      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-3 text-white/90">
        Adivina la Nota
      </h1>
      <p className="text-base text-white/50 max-w-md mb-10 leading-relaxed">
        Entrena tu oído musical. Escucha la nota, encuéntrala en el piano, la guitarra o con el slider de frecuencia.
      </p>

      <div className="flex gap-4 mb-16">
        <Link
          to="/game"
          className="group relative inline-block rounded-xl px-8 py-3 text-white font-medium border border-white/20 hover:border-white/40 transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10">Jugar ahora</span>
          <span className="absolute inset-0 bg-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
        <Link
          to="/leaderboard"
          className="inline-block rounded-xl px-8 py-3 text-white/40 font-medium border border-white/[0.06] hover:border-white/20 hover:text-white/70 transition-all duration-300"
        >
          Ranking
        </Link>
      </div>

      <div className="w-full max-w-3xl mb-16 rounded-2xl overflow-hidden border border-white/[0.06] shadow-[0_0_40px_rgba(255,255,255,0.03)] relative">
        <video
          ref={videoRef}
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full"
          onTimeUpdate={handleTimeUpdate}
        />
        {showCta && (
          <Link
            to="/game"
            className="absolute bottom-[18%] left-1/2 -translate-x-1/2 px-10 py-3 rounded-xl border border-white/30 text-white font-medium text-lg tracking-wide backdrop-blur-sm bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/50 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-300 animate-in fade-in"
            style={{
              animation: 'ctaFadeIn 0.4s ease-out',
            }}
          >
            Jugar ahora →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl w-full">
        {[
          { icon: '♫', title: 'Modo Piano', desc: '2 octavas completas con sostenidos. Toca la nota que escuchaste.' },
          { icon: <Guitar size={24} className="inline-block" />, title: 'Modo Guitarra', desc: 'Mástil interactivo con 6 cuerdas y 12 trastes. Encuentra la nota.' },
          { icon: '〜', title: 'Modo Slider', desc: 'Ajusta la frecuencia en Hz. Prueba tu oído absoluto.' },
        ].map((feature) => (
          <div
            key={feature.title}
            className="group rounded-xl p-6 text-left border border-white/[0.06] hover:border-white/[0.15] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="text-2xl mb-3 text-white/40 group-hover:text-white/60 transition-colors duration-300">
              {feature.icon}
            </div>
            <h3 className="font-medium text-sm text-white/50 uppercase tracking-widest mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-white/40 leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
    </div>
  )
}
