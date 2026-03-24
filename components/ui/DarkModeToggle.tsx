'use client'

import { useDarkMode } from '@/lib/hooks/useDarkMode'
import { Sun, Moon } from 'lucide-react'

export function DarkModeToggle() {
  const { dark, toggle, mounted } = useDarkMode()

  // Evita hidratación incorrecta — no renderiza hasta saber el estado real
  if (!mounted) return <div className="h-9 w-9" />

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Activar modo claro' : 'Activar modo oscuro'}
      className="h-9 w-9 flex items-center justify-center rounded-xl text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 transition-colors"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}
