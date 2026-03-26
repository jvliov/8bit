interface BpmSliderProps {
  bpm: number
  onChange: (bpm: number) => void
}

export function BpmSlider({ bpm, onChange }: BpmSliderProps) {
  return (
    <div className="bpm-control">
      <label className="bpm-label">
        <span className="bpm-value">{bpm}</span>
        <span className="bpm-unit">BPM</span>
      </label>
      <input
        type="range"
        min={60}
        max={180}
        value={bpm}
        onChange={e => onChange(Number(e.target.value))}
        className="bpm-slider"
        aria-label="Tempo"
      />
    </div>
  )
}
