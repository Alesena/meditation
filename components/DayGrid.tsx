'use client'

import { DayCard } from './DayCard'
import type { Dia, Entrega } from '@/lib/types'

interface DayGridProps {
  dias: Dia[]
  entregas: Entrega[]
  activeDia: number | null
  onSelect: (dia: Dia) => void
}

export function DayGrid({ dias, entregas, activeDia, onSelect }: DayGridProps) {
  const completedDays = new Set(entregas.filter((e) => e.completado).map((e) => e.dia))
  const total = 21
  const completedCount = completedDays.size

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm text-stone-600">
          <span>Progreso del desafío</span>
          <span className="font-medium text-sage-600">{completedCount} / {total} días</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-stone-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sage-400 to-sage-600 transition-all duration-700"
            style={{ width: `${(completedCount / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {Array.from({ length: total }, (_, i) => i + 1).map((num) => {
          const dia = dias.find((d) => d.dia === num)
          return (
            <DayCard
              key={num}
              dia={num}
              titulo={dia?.titulo ?? ''}
              completed={completedDays.has(num)}
              active={activeDia === num}
              onClick={() => dia && onSelect(dia)}
            />
          )
        })}
      </div>
    </div>
  )
}
