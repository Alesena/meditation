'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'meditation-theme'

export function useDarkMode() {
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    const isDark = saved === 'dark'
    setDark(isDark)
    setMounted(true)
  }, [])

  function toggle() {
    setDark((prev) => {
      const next = !prev
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light')
      if (next) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return next
    })
  }

  return { dark, toggle, mounted }
}
