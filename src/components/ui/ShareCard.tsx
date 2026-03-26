import { useState } from 'react'
import { PixelButton } from './PixelButton'
import { exportWav, downloadBlob } from '../../utils/wavEncoder'
import type { Grid } from '../../hooks/useGrid'
import type { Waveform } from '../../audio/frequencies'

interface ShareCardProps {
  grid: Grid
  bpm: number
  waveform: Waveform
  onEditAgain: () => void
}

export function ShareCard({ grid, bpm, waveform, onEditAgain }: ShareCardProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleDownload = async () => {
    setIsExporting(true)
    try {
      const blob = await exportWav(grid, bpm, waveform)
      downloadBlob(blob, '8bit-loop.wav')
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="share-card">
      <div className="share-card__title">LOOP COMPLETE!</div>
      <div className="share-card__stats">
        <span>{bpm} BPM</span>
        <span>·</span>
        <span>{waveform.toUpperCase()}</span>
        <span>·</span>
        <span>{countNotes(grid)} NOTES</span>
      </div>
      <div className="share-card__actions">
        <PixelButton variant="primary" size="lg" onClick={handleDownload} disabled={isExporting}>
          {isExporting ? 'EXPORTING...' : '⬇ DOWNLOAD WAV'}
        </PixelButton>
        <PixelButton variant="secondary" onClick={onEditAgain}>
          ← EDIT AGAIN
        </PixelButton>
      </div>
    </div>
  )
}

function countNotes(grid: Grid): number {
  return grid.reduce((sum, row) => sum + row.filter(Boolean).length, 0)
}
