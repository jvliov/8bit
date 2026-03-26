import { ShareCard } from '../ui/ShareCard'
import type { Grid } from '../../hooks/useGrid'
import type { Waveform } from '../../audio/frequencies'

interface FinishScreenProps {
  grid: Grid
  bpm: number
  waveform: Waveform
  onEditAgain: () => void
}

export function FinishScreen({ grid, bpm, waveform, onEditAgain }: FinishScreenProps) {
  return (
    <div className="screen finish-screen">
      <h1 className="app-title-sm">8-BITS</h1>
      <ShareCard grid={grid} bpm={bpm} waveform={waveform} onEditAgain={onEditAgain} />
    </div>
  )
}
