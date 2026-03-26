import type { Grid } from '../hooks/useGrid'
import { FREQUENCIES } from '../audio/frequencies'
import type { Waveform } from '../audio/frequencies'

function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i))
  }
}

function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels
  const sampleRate = buffer.sampleRate
  const numSamples = buffer.length
  const bitsPerSample = 16
  const blockAlign = numChannels * (bitsPerSample / 8)
  const byteRate = sampleRate * blockAlign
  const dataSize = numSamples * blockAlign
  const headerSize = 44
  const arrayBuffer = new ArrayBuffer(headerSize + dataSize)
  const view = new DataView(arrayBuffer)

  writeString(view, 0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeString(view, 8, 'WAVE')
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true)         // chunk size
  view.setUint16(20, 1, true)          // PCM format
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, byteRate, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, bitsPerSample, true)
  writeString(view, 36, 'data')
  view.setUint32(40, dataSize, true)

  // Interleave channels and convert Float32 → Int16
  const channels: Float32Array[] = []
  for (let c = 0; c < numChannels; c++) {
    channels.push(buffer.getChannelData(c))
  }
  let offset = 44
  for (let i = 0; i < numSamples; i++) {
    for (let c = 0; c < numChannels; c++) {
      const sample = Math.max(-1, Math.min(1, channels[c][i]))
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
      offset += 2
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' })
}

export async function exportWav(grid: Grid, bpm: number, waveform: Waveform): Promise<Blob> {
  const sampleRate = 44100
  const stepDuration = 60 / bpm / 4
  const loopDuration = stepDuration * 8
  const numSamples = Math.ceil(sampleRate * loopDuration)
  const offlineCtx = new OfflineAudioContext(2, numSamples, sampleRate)

  const masterGain = offlineCtx.createGain()
  masterGain.gain.setValueAtTime(0.8, 0)
  masterGain.connect(offlineCtx.destination)

  for (let beat = 0; beat < 8; beat++) {
    for (let row = 0; row < 8; row++) {
      if (grid[row][beat]) {
        const time = beat * stepDuration
        const osc = offlineCtx.createOscillator()
        const gain = offlineCtx.createGain()
        osc.type = waveform
        osc.frequency.setValueAtTime(FREQUENCIES[row], time)
        gain.gain.setValueAtTime(0.3, time)
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15)
        osc.connect(gain)
        gain.connect(masterGain)
        osc.start(time)
        osc.stop(time + 0.2)
      }
    }
  }

  const rendered = await offlineCtx.startRendering()
  return audioBufferToWav(rendered)
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const a = document.createElement('a')
  a.href = url
  if (isIOS) {
    a.target = '_blank'
  } else {
    a.download = filename
  }
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
