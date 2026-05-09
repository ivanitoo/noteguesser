import { useState, useRef, useCallback, useEffect } from 'react'
import { NOTES, noteName } from '../utils/notes.js'

const TUNING = [
  { note: 'E4', midi: 64 },
  { note: 'B3', midi: 59 },
  { note: 'G3', midi: 55 },
  { note: 'D3', midi: 50 },
  { note: 'A2', midi: 45 },
  { note: 'E2', midi: 40 },
]

const FRETS = 12

import { memo } from 'react'

const Guitar = memo(function Guitar({ onNoteClick, highlightNote, feedbackNote }) {
  const [active, setActive] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const noteAt = (stringIdx, fret) => TUNING[stringIdx].midi + fret

  const handleClick = useCallback((stringIdx, fret) => {
    const midi = noteAt(stringIdx, fret)
    setActive(midi)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setActive(null), 200)
    onNoteClick?.(midi)
  }, [onNoteClick])

  const getNoteClass = (midi) => {
    let cls = 'guitar-note'
    if (active === midi) cls += ' active'
    if (highlightNote === midi) cls += ' correct'
    if (feedbackNote === midi) cls += ' wrong'
    return cls
  }

  const svgW = 700
  const svgH = 240
  const marginL = 40
  const marginR = 20
  const stringGap = 30
  const startY = 50
  const fretGap = (svgW - marginL - marginR) / FRETS

  return (
    <div className="instrument-container">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-2xl mx-auto">
        {/* Nut */}
        <line x1={marginL} y1={startY - 5} x2={marginL} y2={startY + 5 * stringGap + 5} stroke="#fff" strokeWidth="3" />

        {/* Frets */}
        {Array.from({ length: FRETS + 1 }).map((_, i) => (
          <line
            key={`fret-${i}`}
            x1={marginL + i * fretGap}
            y1={startY - 8}
            x2={marginL + i * fretGap}
            y2={startY + 5 * stringGap + 8}
            stroke={i === 0 || i === FRETS ? '#fff' : '#444'}
            strokeWidth={i === 0 || i === FRETS ? 2 : 1}
          />
        ))}

        {/* Strings */}
        {TUNING.map((_, s) => (
          <line
            key={`string-${s}`}
            x1={marginL}
            y1={startY + s * stringGap}
            x2={marginL + FRETS * fretGap}
            y2={startY + s * stringGap}
            stroke="#fff"
            strokeWidth={1.5 - s * 0.15}
            opacity={0.8}
          />
        ))}

        {/* Fret markers (dots at 3, 5, 7, 9, 12) */}
        {[3, 5, 7, 9, 12].map((f) => {
          if (f > FRETS) return null
          const cx = marginL + (f - 0.5) * fretGap
          return (
            <circle key={`dot-${f}`} cx={cx} cy={startY + 2.5 * stringGap} r="4" fill="#444" />
          )
        })}

        {/* Note markers */}
        {TUNING.map((_, s) =>
          Array.from({ length: FRETS + 1 }).map((_, f) => {
            const midi = noteAt(s, f)
            const cx = marginL + f * fretGap - (f === 0 ? 0 : fretGap / 2)
            return (
              <g
                key={`note-${s}-${f}`}
                className={getNoteClass(midi)}
                onClick={() => handleClick(s, f)}
                style={{ cursor: 'pointer' }}
              >
                <circle cx={cx} cy={startY + s * stringGap} r="12" fill="transparent" stroke="#fff" strokeWidth="1" />
                <circle cx={cx} cy={startY + s * stringGap} r="6" fill="transparent" stroke="none" />
                <text
                  x={cx}
                  y={startY + s * stringGap + 3}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="7"
                  className="pointer-events-none select-none"
                >
                  {NOTES[midi % 12]}
                </text>
              </g>
            )
          })
        )}

        {/* String labels */}
        {TUNING.map((t, s) => (
          <text
            key={`label-${s}`}
            x={marginL - 25}
            y={startY + s * stringGap + 3}
            textAnchor="end"
            fill="#888"
            fontSize="9"
          >
            {t.note}
          </text>
        ))}
      </svg>
    </div>
  )
})

export default Guitar
