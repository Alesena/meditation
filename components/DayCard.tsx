'use client'

import { CheckCircle } from 'lucide-react'

interface DayCardProps {
  dia: number
  titulo: string
  completed: boolean
  active: boolean
  onClick: () => void
}

export function DayCard({ dia, titulo, completed, active, onClick }: DayCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300
        text-center cursor-pointer select-none
        ${active
          ? 'border-sage-500 bg-sage-100 shadow-lg scale-105'
          : completed
            ? 'border-sage-300 bg-sage-50 hover:border-sage-400'
            : 'border-lavender-200 bg-white hover:border-lavender-400 hover:shadow-md'
        }
      `}
    >
      {completed && (
        <CheckCircle
          className="absolute -top-2 -right-2 h-5 w-5 text-sage-500 bg-white rounded-full"
          aria-label="Completado"
        />
      )}
      <span className={`text-lg font-bold ${active ? 'text-sage-700' : 'text-stone-600'}`}>
        {dia}
      </span>
      <span className={`text-[10px] mt-1 leading-tight line-clamp-2 ${active ? 'text-sage-600' : 'text-stone-400'}`}>
        {titulo || `Día ${dia}`}
      </span>
    </button>
  )
}
