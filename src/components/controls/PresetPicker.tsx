import { PRESETS } from '../../data/presets'
import type { Grid } from '../../hooks/useGrid'
import type { Waveform } from '../../audio/frequencies'

interface PresetPickerProps {
  onSelect: (grid: Grid, bpm: number, waveform: Waveform) => void
}

export function PresetPicker({ onSelect }: PresetPickerProps) {
  return (
    <div className="preset-picker">
      {PRESETS.map(p => (
        <button
          key={p.name}
          className="preset-btn"
          onClick={() => onSelect(p.grid, p.bpm, p.waveform)}
        >
          {p.name}
        </button>
      ))}
    </div>
  )
}
