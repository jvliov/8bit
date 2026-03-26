// Pentatonic minor scale: A3–D5
// Row 0 = lowest pitch (bottom of grid), Row 7 = highest pitch (top of grid)
export const FREQUENCIES: number[] = [
  220.00, // A3
  261.63, // C4
  293.66, // D4
  329.63, // E4
  392.00, // G4
  440.00, // A4
  523.25, // C5
  587.33, // D5
]

export type Waveform = 'square' | 'triangle' | 'sawtooth'
