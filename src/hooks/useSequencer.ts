import { useState, useRef, useCallback, useEffect } from 'react'
import { audioEngine } from '../audio/AudioEngine'
import { scheduler } from '../audio/scheduler'
import type { Grid } from './useGrid'
import type { Waveform } from '../audio/frequencies'

export function useSequencer(gridRef: React.RefObject<Grid>, bpm: number, waveform: Waveform) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [playheadBeat, setPlayheadBeat] = useState(-1)
  const rafRef = useRef<number | null>(null)

  // Scheduled beat times ring buffer — maps beat index → scheduled time
  const beatTimesRef = useRef<number[]>(new Array(8).fill(0))
  const bpmRef = useRef(bpm)
  const waveformRef = useRef(waveform)
  useEffect(() => { bpmRef.current = bpm }, [bpm])
  useEffect(() => { waveformRef.current = waveform }, [waveform])

  const stopRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const play = useCallback(() => {
    audioEngine.init()
    scheduler.start(
      audioEngine,
      () => gridRef.current!,
      () => waveformRef.current,
      () => bpmRef.current,
      (beat, time) => {
        beatTimesRef.current[beat] = time
      },
    )
    setIsPlaying(true)
    setPlayheadBeat(0)

    const drawFrame = () => {
      const now = audioEngine.getTime()
      // Find which beat is currently playing based on scheduled times
      let activeBeat = -1
      const stepDuration = 60 / bpmRef.current / 4
      for (let b = 0; b < 8; b++) {
        const t = beatTimesRef.current[b]
        if (t <= now && now < t + stepDuration) {
          activeBeat = b
          break
        }
      }
      setPlayheadBeat(activeBeat)
      rafRef.current = requestAnimationFrame(drawFrame)
    }
    rafRef.current = requestAnimationFrame(drawFrame)
  }, [gridRef])

  const pause = useCallback(() => {
    scheduler.stop()
    stopRaf()
    setIsPlaying(false)
    setPlayheadBeat(-1)
  }, [stopRaf])

  const toggle = useCallback(() => {
    if (isPlaying) pause()
    else play()
  }, [isPlaying, play, pause])

  // bpmRef stays in sync via the effect above — scheduler reads it live, no restart needed

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      scheduler.stop()
      stopRaf()
    }
  }, [stopRaf])

  return { isPlaying, playheadBeat, play, pause, toggle }
}
