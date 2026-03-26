import type { Waveform } from '../../audio/frequencies'

interface WaveformPickerProps {
  value: Waveform
  onChange: (w: Waveform) => void
}

const WAVEFORMS: { value: Waveform; label: string }[] = [
  { value: 'square', label: 'SQR' },
  { value: 'triangle', label: 'TRI' },
  { value: 'sawtooth', label: 'SAW' },
]

export function WaveformPicker({ value, onChange }: WaveformPickerProps) {
  return (
    <div className="waveform-picker">
      {WAVEFORMS.map(w => (
        <button
          key={w.value}
          className={`waveform-btn ${value === w.value ? 'waveform-btn--active' : ''}`}
          onClick={() => onChange(w.value)}
        >
          {w.label}
        </button>
      ))}
    </div>
  )
}
