export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export function noteName(midi) {
  const octave = Math.floor(midi / 12) - 1
  return `${NOTES[midi % 12]}${octave}`
}

export function midiToFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

export function freqToNote(freq) {
  const midi = Math.round(12 * Math.log2(freq / 440) + 69)
  return noteName(midi)
}
