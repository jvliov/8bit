import { useCallback, useRef } from 'react'
import { useLocalStorage } from './useLocalStorage'

export type Grid = boolean[][] // [row][beat], 8 rows × 8 beats

export const EMPTY_GRID: Grid = Array.from({ length: 8 }, () => Array(8).fill(false))

function cloneGrid(g: Grid): Grid {
  return g.map(row => [...row])
}

export function useGrid(initialGrid: Grid = EMPTY_GRID) {
  const [grid, setGrid] = useLocalStorage<Grid>('8bit_grid', initialGrid)

  // Keep a ref in sync so the audio scheduler can always read the latest grid
  const gridRef = useRef<Grid>(grid)
  gridRef.current = grid

  const toggleCell = useCallback((row: number, beat: number) => {
    setGrid(prev => {
      const next = cloneGrid(prev)
      next[row][beat] = !next[row][beat]
      return next
    })
  }, [setGrid])

  const clearGrid = useCallback(() => {
    setGrid(EMPTY_GRID.map(r => [...r]))
  }, [setGrid])

  const setPreset = useCallback((preset: Grid) => {
    setGrid(cloneGrid(preset))
  }, [setGrid])

  const loadGrid = useCallback((g: Grid) => {
    setGrid(cloneGrid(g))
  }, [setGrid])

  return { grid, gridRef, toggleCell, clearGrid, setPreset, loadGrid }
}
