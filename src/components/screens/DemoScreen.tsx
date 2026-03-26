import { useEffect, useRef } from 'react'
import { Grid } from '../grid/Grid'
import { PixelButton } from '../ui/PixelButton'
import { DEMO_GRID } from '../../data/demoGrid'
import { audioEngine } from '../../audio/AudioEngine'
import { scheduler } from '../../audio/scheduler'
import type { Grid as GridType } from '../../hooks/useGrid'
import { useSequencer } from '../../hooks/useSequencer'

interface DemoScreenProps {
  onStart: () => void
}

export function DemoScreen({ onStart }: DemoScreenProps) {
  const demoGridRef = useRef<GridType>(DEMO_GRID)
  const { playheadBeat, play, pause } = useSequencer(demoGridRef, 120, 'square')

  useEffect(() => {
    // Auto-play the demo — requires user gesture in some browsers,
    // so we try and silently fail if blocked
    const tryPlay = async () => {
      try {
        audioEngine.init()
        play()
      } catch {
        // Autoplay blocked — user will hear it after interaction
      }
    }
    tryPlay()
    return () => {
      pause()
      scheduler.stop()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleStart = () => {
    pause()
    scheduler.stop()
    onStart()
  }

  return (
    <div className="screen demo-screen">
      <div className="demo-header">
        <h1 className="app-title">8-BITS</h1>
        <p className="app-subtitle">CHIPTUNE LOOP CREATOR</p>
      </div>
      <div className="demo-grid-wrapper">
        <Grid
          grid={DEMO_GRID}
          playheadBeat={playheadBeat}
          onToggle={() => {}}
          readonly
        />
      </div>
      <div className="demo-cta">
        <PixelButton variant="primary" size="lg" onClick={handleStart}>
          START CREATING
        </PixelButton>
        <p className="demo-hint">TAP CELLS TO PLACE NOTES</p>
      </div>
    </div>
  )
}
