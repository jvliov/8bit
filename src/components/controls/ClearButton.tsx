import { PixelButton } from '../ui/PixelButton'

interface ClearButtonProps {
  onClear: () => void
}

export function ClearButton({ onClear }: ClearButtonProps) {
  return (
    <PixelButton variant="danger" onClick={onClear}>
      CLR
    </PixelButton>
  )
}
