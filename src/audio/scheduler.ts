import type { AudioEngine } from './AudioEngine'
import { FREQUENCIES } from './frequencies'
import type { Waveform } from './frequencies'
import type { Grid } from '../hooks/useGrid'

const LOOKAHEAD = 0.1      // seconds to schedule ahead
const SCHEDULE_INTERVAL = 25 // ms between scheduler ticks

export interface SchedulerState {
  currentBeat: number
  nextNoteTime: number
}

export class Scheduler {
  private timerId: ReturnType<typeof setTimeout> | null = null
  private state: SchedulerState = { currentBeat: 0, nextNoteTime: 0 }
  private onBeat: ((beat: number, time: number) => void) | null = null

  start(
    engine: AudioEngine,
    getGrid: () => Grid,
    getWaveform: () => Waveform,
    getBpm: () => number,
    onBeat: (beat: number, time: number) => void,
  ): void {
    this.stop()
    this.onBeat = onBeat
    this.state = {
      currentBeat: 0,
      nextNoteTime: engine.getTime() + 0.05,
    }
    const tick = () => {
      const now = engine.getTime()
      const bpm = getBpm()
      const stepDuration = 60 / bpm / 4 // 8th-note steps at given BPM (2 bars = 8 steps)
      while (this.state.nextNoteTime < now + LOOKAHEAD) {
        const beat = this.state.currentBeat
        const time = this.state.nextNoteTime
        const grid = getGrid()
        const waveform = getWaveform()
        for (let row = 0; row < 8; row++) {
          if (grid[row][beat]) {
            engine.playNote(FREQUENCIES[row], time, waveform)
          }
        }
        this.onBeat?.(beat, time)
        this.state.nextNoteTime += stepDuration
        this.state.currentBeat = (this.state.currentBeat + 1) % 8
      }
      this.timerId = setTimeout(tick, SCHEDULE_INTERVAL)
    }
    tick()
  }

  stop(): void {
    if (this.timerId !== null) {
      clearTimeout(this.timerId)
      this.timerId = null
    }
    this.onBeat = null
  }

  getNextBeatTime(): number {
    return this.state.nextNoteTime
  }

  getCurrentBeat(): number {
    return this.state.currentBeat
  }
}

export const scheduler = new Scheduler()
