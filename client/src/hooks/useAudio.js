import { useRef, useCallback, useEffect } from 'react'
import * as Tone from 'tone'
import { useVolume } from '../context/VolumeContext.jsx'
import { midiToFreq, noteName } from '../utils/notes.js'

export { noteName, midiToFreq, freqToNote } from '../utils/notes.js'

const PIANO_SAMPLES = {
  'C2': 'C2.mp3', 'C#2': 'Cs2.mp3', 'D2': 'D2.mp3', 'D#2': 'Ds2.mp3',
  'E2': 'E2.mp3', 'F2': 'F2.mp3', 'F#2': 'Fs2.mp3', 'G2': 'G2.mp3',
  'G#2': 'Gs2.mp3', 'A2': 'A2.mp3', 'A#2': 'As2.mp3', 'B2': 'B2.mp3',
  'C3': 'C3.mp3', 'C#3': 'Cs3.mp3', 'D3': 'D3.mp3', 'D#3': 'Ds3.mp3',
  'E3': 'E3.mp3', 'F3': 'F3.mp3', 'F#3': 'Fs3.mp3', 'G3': 'G3.mp3',
  'G#3': 'Gs3.mp3', 'A3': 'A3.mp3', 'A#3': 'As3.mp3', 'B3': 'B3.mp3',
  'C4': 'C4.mp3', 'C#4': 'Cs4.mp3', 'D4': 'D4.mp3', 'D#4': 'Ds4.mp3',
  'E4': 'E4.mp3', 'F4': 'F4.mp3', 'F#4': 'Fs4.mp3', 'G4': 'G4.mp3',
  'G#4': 'Gs4.mp3', 'A4': 'A4.mp3', 'A#4': 'As4.mp3', 'B4': 'B4.mp3',
  'C5': 'C5.mp3', 'C#5': 'Cs5.mp3', 'D5': 'D5.mp3', 'D#5': 'Ds5.mp3',
  'E5': 'E5.mp3', 'F5': 'F5.mp3', 'F#5': 'Fs5.mp3', 'G5': 'G5.mp3',
  'G#5': 'Gs5.mp3', 'A5': 'A5.mp3', 'A#5': 'As5.mp3', 'B5': 'B5.mp3',
  'C6': 'C6.mp3',
}

const GUITAR_SAMPLES = {
  'A2': 'A2.mp3', 'A3': 'A3.mp3', 'A4': 'A4.mp3',
  'A#2': 'As2.mp3', 'A#3': 'As3.mp3', 'A#4': 'As4.mp3',
  'B2': 'B2.mp3', 'B3': 'B3.mp3', 'B4': 'B4.mp3',
  'C3': 'C3.mp3', 'C4': 'C4.mp3', 'C5': 'C5.mp3',
  'C#3': 'Cs3.mp3', 'C#4': 'Cs4.mp3', 'C#5': 'Cs5.mp3',
  'D2': 'D2.mp3', 'D3': 'D3.mp3', 'D4': 'D4.mp3', 'D5': 'D5.mp3',
  'D#2': 'Ds2.mp3', 'D#3': 'Ds3.mp3', 'D#4': 'Ds4.mp3',
  'E2': 'E2.mp3', 'E3': 'E3.mp3', 'E4': 'E4.mp3',
  'F2': 'F2.mp3', 'F3': 'F3.mp3', 'F4': 'F4.mp3',
  'F#2': 'Fs2.mp3', 'F#3': 'Fs3.mp3', 'F#4': 'Fs4.mp3',
  'G2': 'G2.mp3', 'G3': 'G3.mp3', 'G4': 'G4.mp3',
  'G#2': 'Gs2.mp3', 'G#3': 'Gs3.mp3', 'G#4': 'Gs4.mp3',
}

export function useAudio() {
  const { getMasterGain } = useVolume()
  const synthRef = useRef(null)
  const oscRef = useRef(null)
  const guitarRef = useRef(null)
  const gainRef = useRef(null)
  const playTimerRef = useRef(null)
  const stopTimerRef = useRef(null)

  useEffect(() => {
    const synths = [synthRef, guitarRef, oscRef]
    return () => {
      if (playTimerRef.current) clearTimeout(playTimerRef.current)
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current)
      synths.forEach((ref) => {
        if (ref.current) {
          if (ref.current.state === 'started') ref.current.stop()
          if (ref.current.dispose) ref.current.dispose()
          ref.current = null
        }
      })
    }
  }, [])

  const ensurePiano = useCallback(async () => {
    await Tone.start()
    if (!synthRef.current) {
      gainRef.current = getMasterGain()
      const reverb = new Tone.Reverb({ decay: 2.5, wet: 0.12 }).connect(gainRef.current)
      synthRef.current = new Tone.Sampler({
        urls: PIANO_SAMPLES,
        baseUrl: '/piano-acoustic/',
        release: 2,
      }).connect(reverb)
      await Tone.loaded()
    }
  }, [getMasterGain])

  const ensureGuitar = useCallback(async () => {
    await Tone.start()
    if (!guitarRef.current) {
      gainRef.current = getMasterGain()
      const reverb = new Tone.Reverb({ decay: 1.5, wet: 0.15 }).connect(gainRef.current)
      guitarRef.current = new Tone.Sampler({
        urls: GUITAR_SAMPLES,
        baseUrl: '/guitar-acoustic/',
        release: 1.5,
      }).connect(reverb)
      await Tone.loaded()
    }
  }, [getMasterGain])

  const ensureSlider = useCallback(async () => {
    await Tone.start()
    if (!oscRef.current) {
      gainRef.current = getMasterGain()
      oscRef.current = new Tone.Oscillator({
        type: 'sine',
        frequency: 440,
      }).connect(gainRef.current)
    }
  }, [getMasterGain])

  const playPianoNote = useCallback(async (midi) => {
    await ensurePiano()
    const note = noteName(midi)
    synthRef.current.triggerAttackRelease(note, '0.8')
  }, [ensurePiano])

  const playGuitarNote = useCallback(async (midi) => {
    await ensureGuitar()
    const note = noteName(midi)
    guitarRef.current.triggerAttackRelease(note, '1.2')
  }, [ensureGuitar])

  const playSliderFreq = useCallback(async (freq) => {
    await ensureSlider()
    if (playTimerRef.current) clearTimeout(playTimerRef.current)
    oscRef.current.frequency.setValueAtTime(freq, Tone.now())
    if (oscRef.current.state !== 'started') oscRef.current.start()
    playTimerRef.current = setTimeout(() => {
      if (oscRef.current && oscRef.current.state === 'started') {
        oscRef.current.stop()
      }
    }, 1200)
  }, [ensureSlider])

  const startSliderFreq = useCallback(async (freq) => {
    await ensureSlider()
    if (playTimerRef.current) clearTimeout(playTimerRef.current)
    if (stopTimerRef.current) clearTimeout(stopTimerRef.current)
    oscRef.current.frequency.setValueAtTime(freq, Tone.now())
    if (oscRef.current.state !== 'started') oscRef.current.start()
  }, [ensureSlider])

  const updateSliderFreq = useCallback((freq) => {
    if (oscRef.current) {
      oscRef.current.frequency.setValueAtTime(freq, Tone.now())
    }
  }, [])

  const stopSlider = useCallback((immediate) => {
    if (playTimerRef.current) clearTimeout(playTimerRef.current)
    if (stopTimerRef.current) clearTimeout(stopTimerRef.current)
    if (!oscRef.current || oscRef.current.state !== 'started') return
    if (immediate) {
      oscRef.current.stop()
    } else {
      stopTimerRef.current = setTimeout(() => {
        if (oscRef.current && oscRef.current.state === 'started') {
          oscRef.current.stop()
        }
      }, 300)
    }
  }, [])

  const playNote = useCallback(async (mode, midiOrFreq) => {
    if (mode === 'piano') {
      await playPianoNote(midiOrFreq)
    } else if (mode === 'guitar') {
      await playGuitarNote(midiOrFreq)
    }
  }, [playPianoNote, playGuitarNote])

  return {
    playNote, playPianoNote, playGuitarNote,
    playSliderFreq, startSliderFreq, updateSliderFreq, stopSlider,
    ensurePiano, ensureGuitar, ensureSlider,
  }
}
