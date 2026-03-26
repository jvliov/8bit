import { useRef } from 'react'
import { GridCell } from './GridCell'
import type { Grid as GridType } from '../../hooks/useGrid'

interface GridProps {
  grid: GridType
  playheadBeat: number
  onToggle: (row: number, beat: number) => void
  readonly?: boolean
}

export function Grid({ grid, playheadBeat, onToggle, readonly = false }: GridProps) {
  const lastToggledRef = useRef<string | null>(null)
  const isDraggingRef = useRef(false)

  const handlePointerDown = (row: number, beat: number) => {
    if (readonly) return
    isDraggingRef.current = true
    const key = `${row}-${beat}`
    lastToggledRef.current = key
    onToggle(row, beat)
  }

  const handlePointerEnter = (row: number, beat: number) => {
    if (readonly || !isDraggingRef.current) return
    const key = `${row}-${beat}`
    if (lastToggledRef.current !== key) {
      lastToggledRef.current = key
      onToggle(row, beat)
    }
  }

  const handlePointerUp = () => {
    isDraggingRef.current = false
    lastToggledRef.current = null
  }

  return (
    <div
      className="grid-container"
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Render rows in reverse so row 7 (highest pitch) is at top */}
      {[...Array(8)].map((_, ri) => {
        const row = 7 - ri
        return (
          <div key={row} className="grid-row">
            {[...Array(8)].map((_, beat) => (
              <GridCell
                key={beat}
                active={grid[row][beat]}
                isPlayhead={playheadBeat === beat}
                row={row}
                beat={beat}
                onPointerDown={handlePointerDown}
                onPointerEnter={handlePointerEnter}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}
