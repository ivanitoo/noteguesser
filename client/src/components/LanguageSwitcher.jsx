import { useState, useRef } from 'react'
import { useLocale } from '../context/LocaleContext.jsx'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()
  const [open, setOpen] = useState(false)
  const timer = useRef(null)

  const show = () => {
    if (timer.current) clearTimeout(timer.current)
    setOpen(true)
  }

  const hide = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(false), 200)
  }

  const options = [
    { id: 'es', label: 'Español' },
    { id: 'en', label: 'English' },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        onMouseEnter={show}
        onMouseLeave={hide}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium border border-white/10 rounded-lg text-white/60 hover:text-white/80 hover:border-white/30 transition-colors duration-200"
      >
        <span>{locale === 'es' ? 'ES' : 'EN'}</span>
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          onMouseEnter={show}
          onMouseLeave={hide}
          className="absolute right-0 top-full mt-1.5 w-32 bg-[#0a0a0f] border border-white/10 rounded-lg overflow-hidden shadow-xl z-50"
        >
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => { setLocale(opt.id); setOpen(false) }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors duration-200 ${
                locale === opt.id
                  ? 'text-white bg-white/10'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              {opt.label}
              {locale === opt.id && (
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
