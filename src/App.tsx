import { useState } from 'react'
import { DemoScreen } from './components/screens/DemoScreen'
import { EditorScreen } from './components/screens/EditorScreen'
import { FinishScreen } from './components/screens/FinishScreen'
import { CrtOverlay } from './components/ui/CrtOverlay'
import type { Grid } from './hooks/useGrid'
import type { Waveform } from './audio/frequencies'
import { EMPTY_GRID } from './hooks/useGrid'
import { decodeShareUrl } from './utils/shareUrl'

type Screen = 'demo' | 'editor' | 'finish'

interface FinishState {
  grid: Grid
  bpm: number
  waveform: Waveform
}

export default function App() {
  const [screen, setScreen] = useState<Screen>(() => {
    // If the URL contains a valid share hash, pre-load it into localStorage
    // and jump straight to the editor — skipping the demo screen.
    const hash = window.location.hash
    if (hash) {
      const shared = decodeShareUrl(hash)
      if (shared) {
        try {
          localStorage.setItem('8bit_grid', JSON.stringify(shared.grid))
          localStorage.setItem('8bit_bpm', JSON.stringify(shared.bpm))
          localStorage.setItem('8bit_waveform', JSON.stringify(shared.waveform))
        } catch {
          // localStorage unavailable — state will still load from props
        }
        window.history.replaceState(null, '', window.location.pathname)
        return 'editor'
      }
    }
    return 'demo'
  })

  const [finishState, setFinishState] = useState<FinishState>({
    grid: EMPTY_GRID,
    bpm: 120,
    waveform: 'square',
  })

  return (
    <div className="app">
      <CrtOverlay />
      {screen === 'demo' && (
        <DemoScreen onStart={() => setScreen('editor')} />
      )}
      {screen === 'editor' && (
        <EditorScreen
          onFinish={(grid, bpm, waveform) => {
            setFinishState({ grid, bpm, waveform })
            setScreen('finish')
          }}
        />
      )}
      {screen === 'finish' && (
        <FinishScreen
          grid={finishState.grid}
          bpm={finishState.bpm}
          waveform={finishState.waveform}
          onEditAgain={() => setScreen('editor')}
        />
      )}
    </div>
  )
}
