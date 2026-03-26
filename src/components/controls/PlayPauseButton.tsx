import { PixelButton } from '../ui/PixelButton'

interface PlayPauseButtonProps {
  isPlaying: boolean
  onToggle: () => void
}

export function PlayPauseButton({ isPlaying, onToggle }: PlayPauseButtonProps) {
  return (
    <PixelButton variant="primary" onClick={onToggle} title={isPlaying ? 'Pause' : 'Play'}>
      {isPlaying ? '⏸ STOP' : '▶ PLAY'}
    </PixelButton>
  )
}
