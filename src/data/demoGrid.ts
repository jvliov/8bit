import type { Grid } from '../hooks/useGrid'

// Pre-composed ascending motif — rows 0–7 (A3–D5), beats 0–7
// Designed to sound musical with any pentatonic minor combination
export const DEMO_GRID: Grid = [
  //     0      1      2      3      4      5      6      7
  [true,  false, false, false, true,  false, false, false], // row 0: A3
  [false, true,  false, false, false, false, true,  false], // row 1: C4
  [false, false, true,  false, false, true,  false, false], // row 2: D4
  [false, false, false, true,  false, false, false, false], // row 3: E4
  [false, false, false, false, true,  false, false, true ], // row 4: G4
  [false, false, false, false, false, true,  false, false], // row 5: A4
  [false, false, false, false, false, false, true,  false], // row 6: C5
  [false, false, false, false, false, false, false, true ], // row 7: D5
]
