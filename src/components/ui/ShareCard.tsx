import { useState } from 'react'
import { PixelButton } from './PixelButton'
import { encodeShareUrl } from '../../utils/shareUrl'
import type { Grid } from '../../hooks/useGrid'
import type { Waveform } from '../../audio/frequencies'

interface ShareCardProps {
  grid: Grid
  bpm: number
  waveform: Waveform
  onEditAgain: () => void
}

export function ShareCard({ grid, bpm, waveform, onEditAgain }: ShareCardProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = encodeShareUrl(grid, bpm, waveform)
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Fallback for browsers that block clipboard without HTTPS or permissions
      const input = document.createElement('input')
      input.value = url
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
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
        <PixelButton variant="primary" size="lg" onClick={handleShare}>
          {copied ? '✓ COPIED!' : '⬆ SHARE LINK'}
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
