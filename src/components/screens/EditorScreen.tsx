import { Grid } from '../grid/Grid'
import { PlayPauseButton } from '../controls/PlayPauseButton'
import { ClearButton } from '../controls/ClearButton'
import { BpmSlider } from '../controls/BpmSlider'
import { WaveformPicker } from '../controls/WaveformPicker'
import { PresetPicker } from '../controls/PresetPicker'
import { PixelButton } from '../ui/PixelButton'
import { audioEngine } from '../../audio/AudioEngine'
import { FREQUENCIES } from '../../audio/frequencies'
import { useGrid } from '../../hooks/useGrid'
import { useSequencer } from '../../hooks/useSequencer'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import type { Waveform } from '../../audio/frequencies'
import type { Grid as GridType } from '../../hooks/useGrid'

interface EditorScreenProps {
  onFinish: (grid: GridType, bpm: number, waveform: Waveform) => void
}

export function EditorScreen({ onFinish }: EditorScreenProps) {
  const { grid, gridRef, toggleCell, clearGrid, loadGrid } = useGrid()
  const [bpm, setBpm] = useLocalStorage<number>('8bit_bpm', 120)
  const [waveform, setWaveform] = useLocalStorage<Waveform>('8bit_waveform', 'square')
  const { isPlaying, playheadBeat, toggle } = useSequencer(gridRef, bpm, waveform)

  const handleToggle = (row: number, beat: number) => {
    audioEngine.init()
    audioEngine.previewNote(FREQUENCIES[row], waveform)
    toggleCell(row, beat)
  }

  const handlePresetSelect = (presetGrid: GridType, presetBpm: number, presetWaveform: Waveform) => {
    loadGrid(presetGrid)
    setBpm(presetBpm)
    setWaveform(presetWaveform)
  }

  const handleFinish = () => {
    onFinish(grid, bpm, waveform)
  }

  return (
    <div className="screen editor-screen">
      <div className="editor-header">
        <h1 className="app-title-sm">8-BITS</h1>
        <div className="editor-top-controls">
          <PlayPauseButton isPlaying={isPlaying} onToggle={toggle} />
          <ClearButton onClear={clearGrid} />
        </div>
      </div>

      <div className="editor-grid-wrapper">
        <Grid
          grid={grid}
          playheadBeat={playheadBeat}
          onToggle={handleToggle}
        />
      </div>

      <div className="editor-bottom">
        <div className="editor-controls-row">
          <BpmSlider bpm={bpm} onChange={setBpm} />
          <WaveformPicker value={waveform} onChange={setWaveform} />
        </div>
        <PresetPicker onSelect={handlePresetSelect} />
        <PixelButton variant="primary" size="lg" className="finish-btn" onClick={handleFinish}>
          FINISH ▶
        </PixelButton>
      </div>
    </div>
  )
}
