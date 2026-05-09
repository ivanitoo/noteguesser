import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import * as Tone from 'tone'
import { useVolume } from '../context/VolumeContext.jsx'

const CHORDS = [
  ['C3', 'G3', 'A3', 'E4'],
  ['F2', 'C3', 'F3', 'A3'],
  ['G2', 'D3', 'G3', 'B3'],
  ['A2', 'E3', 'A3', 'C4'],
]

export default function BackgroundMusic() {
  const { volume, isMuted, getMasterGain } = useVolume()
  const location = useLocation()
  const synthRef = useRef(null)
  const intervalRef = useRef(null)
  const chordIndexRef = useRef(0)
  const startedRef = useRef(false)

  useEffect(() => {
    let cancelled = false

    const startMusic = async () => {
      await Tone.start()
      if (cancelled) return
      if (startedRef.current) return
      startedRef.current = true

      const gain = getMasterGain()
      const reverb = new Tone.Reverb({ decay: 5, wet: 0.4 }).connect(gain)
      const chorus = new Tone.Chorus(0.4, 2, 0.2).connect(reverb)
      chorus.start()

      synthRef.current = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: { attack: 1, decay: 0.5, sustain: 0.3, release: 3 },
      }).connect(chorus)

      const playChord = () => {
        if (!synthRef.current) return
        const chord = CHORDS[chordIndexRef.current % CHORDS.length]
        synthRef.current.triggerAttackRelease(chord, 4)
        chordIndexRef.current++
      }

      playChord()
      intervalRef.current = setInterval(playChord, 5500)
    }

    const onInteraction = () => {
      if (location.pathname === '/' && !startedRef.current) {
        startMusic()
      }
    }

    document.addEventListener('pointerdown', onInteraction)

    return () => {
      cancelled = true
      document.removeEventListener('pointerdown', onInteraction)
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (synthRef.current) {
        synthRef.current.releaseAll()
        synthRef.current.dispose()
        synthRef.current = null
      }
      startedRef.current = false
    }
  }, [location.pathname, getMasterGain])

  useEffect(() => {
    if (synthRef.current) {
      const db = isMuted ? -Infinity : -22 + (volume * 18)
      synthRef.current.volume.rampTo(db, 0.3)
    }
  }, [volume, isMuted])

  return null
}
