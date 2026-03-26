import { useState } from 'react'
import { DemoScreen } from './components/screens/DemoScreen'
import { EditorScreen } from './components/screens/EditorScreen'
import { FinishScreen } from './components/screens/FinishScreen'
import { CrtOverlay } from './components/ui/CrtOverlay'
import type { Grid } from './hooks/useGrid'
import type { Waveform } from './audio/frequencies'
import { EMPTY_GRID } from './hooks/useGrid'

type Screen = 'demo' | 'editor' | 'finish'

interface FinishState {
  grid: Grid
  bpm: number
  waveform: Waveform
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('demo')
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
