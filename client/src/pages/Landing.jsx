import { useRef, useState } from 'react'
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

  return (
    <div className="relative flex flex-col items-center px-4 py-16 text-center overflow-hidden">
      {/* Piano keyboard background pattern */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-[0.035]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="pianokeys" x="0" y="0" width="140" height="100%" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="20" height="100%" fill="rgba(255,255,255,0.6)" />
              <rect x="20" y="0" width="1" height="100%" fill="rgba(255,255,255,0.9)" />
              <rect x="21" y="0" width="19" height="100%" fill="rgba(255,255,255,0.6)" />
              <rect x="40" y="0" width="1" height="100%" fill="rgba(255,255,255,0.9)" />
              <rect x="41" y="0" width="19" height="100%" fill="rgba(255,255,255,0.6)" />
              <rect x="60" y="0" width="1" height="100%" fill="rgba(255,255,255,0.9)" />
              <rect x="61" y="0" width="19" height="100%" fill="rgba(255,255,255,0.6)" />
              <rect x="80" y="0" width="1" height="100%" fill="rgba(255,255,255,0.9)" />
              <rect x="81" y="0" width="19" height="100%" fill="rgba(255,255,255,0.6)" />
              <rect x="100" y="0" width="1" height="100%" fill="rgba(255,255,255,0.9)" />
              <rect x="101" y="0" width="19" height="100%" fill="rgba(255,255,255,0.6)" />
              <rect x="120" y="0" width="1" height="100%" fill="rgba(255,255,255,0.9)" />
              <rect x="121" y="0" width="19" height="100%" fill="rgba(255,255,255,0.6)" />
              <rect x="140" y="0" width="1" height="100%" fill="rgba(255,255,255,0.9)" />

              <rect x="4" y="0" width="16" height="60%" fill="rgba(0,0,0,0.9)" rx="1" />
              <rect x="24" y="0" width="16" height="60%" fill="rgba(0,0,0,0.9)" rx="1" />
              <rect x="64" y="0" width="16" height="60%" fill="rgba(0,0,0,0.9)" rx="1" />
              <rect x="84" y="0" width="16" height="60%" fill="rgba(0,0,0,0.9)" rx="1" />
              <rect x="104" y="0" width="16" height="60%" fill="rgba(0,0,0,0.9)" rx="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pianokeys)" />
        </svg>
      </div>
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
