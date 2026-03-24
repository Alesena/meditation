'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { DayList } from '@/components/admin/DayList'
import { SubmissionsList } from '@/components/admin/SubmissionsList'
import { Leaf, LogOut, LayoutGrid, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { DarkModeToggle } from '@/components/ui/DarkModeToggle'

type Tab = 'dias' | 'entregas'

export default function AdminPage() {
  const { user, signOut } = useAuth()
  const [tab, setTab] = useState<Tab>('dias')

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[var(--color-background)]/90 backdrop-blur-md border-b border-sage-100">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-sage-500 flex items-center justify-center">
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold text-stone-700">Admin</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-600 hidden sm:block">{user?.email}</span>
            <DarkModeToggle />
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-red-500 dark:text-stone-400 transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-stone-100 pb-1">
          <button
            onClick={() => setTab('dias')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-xl text-sm font-medium transition border-b-2 -mb-[3px]
              ${tab === 'dias'
                ? 'border-sage-500 text-sage-600'
                : 'border-transparent text-stone-600 hover:text-stone-700'}`}
          >
            <LayoutGrid className="h-4 w-4" />
            Días
          </button>
          <button
            onClick={() => setTab('entregas')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-xl text-sm font-medium transition border-b-2 -mb-[3px]
              ${tab === 'entregas'
                ? 'border-sage-500 text-sage-600'
                : 'border-transparent text-stone-600 hover:text-stone-700'}`}
          >
            <BookOpen className="h-4 w-4" />
            Entregas
          </button>
        </div>

        {/* Tab content */}
        {tab === 'dias' ? <DayList /> : <SubmissionsList />}
      </main>
    </div>
  )
}
