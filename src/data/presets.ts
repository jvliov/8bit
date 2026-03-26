import type { Grid } from '../hooks/useGrid'
import type { Waveform } from '../audio/frequencies'

export interface Preset {
  name: string
  grid: Grid
  bpm: number
  waveform: Waveform
}

export const PRESETS: Preset[] = [
  {
    name: 'BOSS FIGHT',
    bpm: 160,
    waveform: 'sawtooth',
    grid: [
      [true,  false, true,  false, true,  false, true,  false], // A3
      [false, false, true,  false, false, false, true,  false], // C4
      [false, true,  false, false, false, true,  false, false], // D4
      [false, false, false, false, false, false, false, false], // E4
      [true,  false, false, true,  false, false, false, true ], // G4
      [false, false, false, false, false, false, false, false], // A4
      [false, false, false, false, false, false, false, false], // C5
      [false, false, false, false, false, false, false, false], // D5
    ],
  },
  {
    name: 'VICTORY',
    bpm: 140,
    waveform: 'square',
    grid: [
      [true,  false, false, false, false, false, false, false], // A3
      [false, false, false, false, false, false, false, false], // C4
      [false, true,  false, false, false, false, false, false], // D4
      [false, false, true,  false, false, false, false, true ], // E4
      [false, false, false, false, false, false, false, false], // G4
      [false, false, false, true,  false, false, true,  false], // A4
      [false, false, false, false, true,  false, false, false], // C5
      [false, false, false, false, false, true,  false, false], // D5
    ],
  },
  {
    name: 'DUNGEON',
    bpm: 80,
    waveform: 'triangle',
    grid: [
      [true,  false, false, false, true,  false, false, true ], // A3
      [false, false, false, false, false, false, false, false], // C4
      [false, false, true,  false, false, false, false, false], // D4
      [false, false, false, false, false, false, false, false], // E4
      [false, false, false, false, false, false, false, false], // G4
      [false, false, false, false, false, false, false, false], // A4
      [false, false, false, false, false, false, false, false], // C5
      [false, false, false, false, false, false, false, false], // D5
    ],
  },
]
