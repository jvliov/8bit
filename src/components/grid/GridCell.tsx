import { useRef } from 'react'

interface GridCellProps {
  active: boolean
  isPlayhead: boolean
  row: number
  beat: number
  onPointerDown: (row: number, beat: number) => void
  onPointerEnter: (row: number, beat: number) => void
}

// Neon colors per row (bottom to top)
const ROW_COLORS = [
  '#ff6b6b', // row 0 - red-ish
  '#ff9f43', // row 1 - orange
  '#ffd43b', // row 2 - yellow
  '#69db7c', // row 3 - green
  '#00ffff', // row 4 - cyan
  '#74c0fc', // row 5 - blue
  '#cc5de8', // row 6 - purple
  '#ff6b81', // row 7 - pink
]

export function GridCell({ active, isPlayhead, row, beat, onPointerDown, onPointerEnter }: GridCellProps) {
  const animKey = useRef(0)

  const handlePointerDown = () => {
    animKey.current += 1
    onPointerDown(row, beat)
  }

  const handlePointerEnter = (e: React.PointerEvent) => {
    if (e.buttons === 1) {
      onPointerEnter(row, beat)
    }
  }

  const color = ROW_COLORS[row]

  return (
    <div
      className={`grid-cell ${active ? 'grid-cell--active' : ''} ${isPlayhead ? 'grid-cell--playhead' : ''}`}
      style={active ? { '--cell-color': color } as React.CSSProperties : undefined}
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnter}
      role="button"
      aria-pressed={active}
      aria-label={`Row ${row + 1}, Beat ${beat + 1}`}
    />
  )
}
