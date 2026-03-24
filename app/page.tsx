'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useDias } from '@/lib/hooks/useDias'
import { useEntregas } from '@/lib/hooks/useEntregas'
import { DayGrid } from '@/components/DayGrid'
import { DayDetail } from '@/components/DayDetail'
import { Spinner } from '@/components/ui/Spinner'
import type { Dia } from '@/lib/types'
import { Leaf, Settings } from 'lucide-react'
import Link from 'next/link'
import { DarkModeToggle } from '@/components/ui/DarkModeToggle'

const LAST_DAY_KEY = 'meditation-last-day'

export default function Home() {
  const { data: dias, isLoading: loadingDias } = useDias()
  const { data: entregas, isLoading: loadingEntregas } = useEntregas()
  const [selectedDia, setSelectedDia] = useState<Dia | null>(null)

  // Restore last selected day from localStorage
  useEffect(() => {
    if (!dias?.length) return
    const saved = localStorage.getItem(LAST_DAY_KEY)
    if (saved) {
      const num = parseInt(saved, 10)
      const found = dias.find((d) => d.dia === num)
      if (found) { setSelectedDia(found); return }
    }
    setSelectedDia(dias[0])
  }, [dias])

  function handleSelectDia(dia: Dia) {
    setSelectedDia(dia)
    localStorage.setItem(LAST_DAY_KEY, String(dia.dia))
  }

  const isLoading = loadingDias || loadingEntregas

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-sage-100">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-sage-500 flex items-center justify-center">
              <Leaf className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-stone-800 leading-none">Meditación</h1>
              <p className="text-[10px] text-stone-600 leading-none">Desafío 21 días</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <DarkModeToggle />
            <Link
              href="/admin"
              className="h-9 w-9 flex items-center justify-center rounded-xl text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 transition"
              title="Administración"
            >
              <Settings className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            {/* Day selector grid */}
            <section>
              <DayGrid
                dias={dias ?? []}
                entregas={entregas ?? []}
                activeDia={selectedDia?.dia ?? null}
                onSelect={handleSelectDia}
              />
            </section>

            {/* Day detail */}
            {selectedDia ? (
              <section key={selectedDia.id}>
                <DayDetail dia={selectedDia} />
              </section>
            ) : (
              dias?.length === 0 && (
                <div className="text-center py-20 space-y-3">
                  <div className="h-16 w-16 rounded-2xl bg-sage-100 flex items-center justify-center mx-auto">
                    <Leaf className="h-8 w-8 text-sage-400" />
                  </div>
                  <p className="text-stone-600 text-sm">
                    Aún no hay días cargados.{' '}
                    <Link href="/admin" className="text-sage-600 underline underline-offset-2 font-medium">
                      Ve al panel admin
                    </Link>{' '}
                    para empezar.
                  </p>
                </div>
              )
            )}
          </>
        )}
      </main>
    </div>
  )
}
