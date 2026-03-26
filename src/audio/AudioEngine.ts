import type { Waveform } from './frequencies'

export class AudioEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null

  init(): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume()
      }
      return
    }
    this.ctx = new AudioContext()
    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime)
    this.masterGain.connect(this.ctx.destination)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  getTime(): number {
    return this.ctx?.currentTime ?? 0
  }

  isReady(): boolean {
    return this.ctx !== null && this.ctx.state === 'running'
  }

  playNote(freq: number, time: number, waveform: Waveform = 'square'): void {
    if (!this.ctx || !this.masterGain) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = waveform
    osc.frequency.setValueAtTime(freq, time)
    gain.gain.setValueAtTime(0.3, time)
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15)
    osc.connect(gain)
    gain.connect(this.masterGain)
    osc.start(time)
    osc.stop(time + 0.2)
  }

  previewNote(freq: number, waveform: Waveform = 'square'): void {
    if (!this.ctx) return
    const time = this.ctx.currentTime
    this.playNote(freq, time, waveform)
  }

  destroy(): void {
    this.ctx?.close()
    this.ctx = null
    this.masterGain = null
  }
}

// Singleton
export const audioEngine = new AudioEngine()
