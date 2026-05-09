import { useState, useCallback, useEffect } from 'react'
import { noteName } from '../utils/notes.js'

const MIN_FREQ = 130.81
const MAX_FREQ = 523.25

export default function SliderFreq({ onSliderChange, onSliderStart, onSliderEnd, highlightFreq, feedbackNote }) {
  const [freq, setFreq] = useState(261.63)

  useEffect(() => {
    setFreq(261.63)
  }, [])

  const handleChange = useCallback((e) => {
    const val = Number(e.target.value)
    setFreq(val)
    onSliderChange?.(val)
  }, [onSliderChange])

  const handlePointerDown = useCallback(() => {
    onSliderStart?.(freq)
  }, [freq, onSliderStart])

  const handlePointerUp = useCallback(() => {
    onSliderEnd?.()
  }, [onSliderEnd])

  return (
    <div className="instrument-container w-full max-w-xl mx-auto px-4">
      <div className="text-center mb-8">
        <div className="text-6xl font-light mb-2">{noteName(Math.round(12 * Math.log2(freq / 440) + 69))}</div>
        <div className="text-lg text-white/50 font-mono">{freq.toFixed(1)} Hz</div>
      </div>

      <div className="relative">
        <input
          type="range"
          min={MIN_FREQ}
          max={MAX_FREQ}
          step={0.1}
          value={freq}
          onChange={handleChange}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          className="w-full"
        />
        <div className="flex justify-between mt-2 text-[9px] text-white/30 font-mono px-0.5 select-none">
          <span>130Hz</span>
          <span>262Hz</span>
          <span>392Hz</span>
          <span>523Hz</span>
        </div>
      </div>
    </div>
  )
}
