import type { Grid } from '../hooks/useGrid'
import type { Waveform } from '../audio/frequencies'

const WAVE_ENCODE: Record<Waveform, string> = {
  square: 'sq',
  triangle: 'tri',
  sawtooth: 'saw',
}

const WAVE_DECODE: Record<string, Waveform> = {
  sq: 'square',
  tri: 'triangle',
  saw: 'sawtooth',
}

/**
 * Encodes the full loop state into a shareable URL hash.
 * Grid (8×8 booleans) is packed into 8 bytes → base64url → ~11 chars.
 * Example hash: #g=XXXXXXXXXXX&b=120&w=sq
 */
export function encodeShareUrl(grid: Grid, bpm: number, waveform: Waveform): string {
  // Pack each row into one byte (bit N = beat N)
  const bytes = new Uint8Array(8)
  for (let row = 0; row < 8; row++) {
    let byte = 0
    for (let col = 0; col < 8; col++) {
      if (grid[row]?.[col]) byte |= 1 << col
    }
    bytes[row] = byte
  }

  // base64url encode (URL-safe, no padding)
  const b64 = btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')

  const w = WAVE_ENCODE[waveform] ?? 'sq'
  const hash = `g=${b64}&b=${bpm}&w=${w}`
  return `${window.location.origin}${window.location.pathname}#${hash}`
}

/**
 * Decodes a URL hash back into loop state.
 * Returns null if the hash is missing or malformed.
 */
export function decodeShareUrl(
  hash: string,
): { grid: Grid; bpm: number; waveform: Waveform } | null {
  try {
    const params = new URLSearchParams(hash.replace(/^#/, ''))
    const g = params.get('g')
    const b = params.get('b')
    const w = params.get('w')
    if (!g || !b || !w) return null

    // Decode base64url back to bytes
    const b64 = g.replace(/-/g, '+').replace(/_/g, '/')
    const binary = atob(b64)
    if (binary.length !== 8) return null

    const grid: Grid = []
    for (let row = 0; row < 8; row++) {
      const byte = binary.charCodeAt(row)
      const rowArr: boolean[] = []
      for (let col = 0; col < 8; col++) {
        rowArr.push(!!(byte & (1 << col)))
      }
      grid.push(rowArr)
    }

    const bpm = Math.max(60, Math.min(180, parseInt(b, 10)))
    if (isNaN(bpm)) return null
    const waveform = WAVE_DECODE[w] ?? 'square'

    return { grid, bpm, waveform }
  } catch {
    return null
  }
}
