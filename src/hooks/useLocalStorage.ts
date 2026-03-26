import { useState } from 'react'

type Updater<T> = T | ((prev: T) => T)

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (v: Updater<T>) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const setAndPersist = (updater: Updater<T>) => {
    setValue(prev => {
      const next = typeof updater === 'function' ? (updater as (p: T) => T)(prev) : updater
      try {
        localStorage.setItem(key, JSON.stringify(next))
      } catch {
        // quota exceeded — fail silently
      }
      return next
    })
  }

  return [value, setAndPersist]
}
