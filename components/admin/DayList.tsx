'use client'

import { useState } from 'react'
import { useDias, useDeleteDia } from '@/lib/hooks/useDias'
import { DayForm } from './DayForm'
import { Spinner } from '@/components/ui/Spinner'
import type { Dia } from '@/lib/types'
import { Pencil, Trash2, Music, Plus } from 'lucide-react'

export function DayList() {
  const { data: dias, isLoading } = useDias()
  const deleteDia = useDeleteDia()
  const [editing, setEditing] = useState<Dia | 'new' | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-stone-700">Días del desafío</h2>
        <button
          onClick={() => setEditing('new')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-sm font-medium transition"
        >
          <Plus className="h-4 w-4" />
          Nuevo día
        </button>
      </div>

      {/* Form modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-semibold text-stone-700 mb-4">
              {editing === 'new' ? 'Crear nuevo día' : `Editar Día ${(editing as Dia).dia}`}
            </h3>
            <DayForm
              dia={editing === 'new' ? undefined : (editing as Dia)}
              onClose={() => setEditing(null)}
            />
          </div>
        </div>
      )}

      {/* Confirm delete dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center space-y-4">
            <p className="text-stone-700 font-medium">¿Eliminar este día?</p>
            <p className="text-sm text-stone-600">Se eliminará también el audio de Storage.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-sm hover:bg-stone-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  const dia = dias?.find((d) => d.id === confirmDelete)
                  await deleteDia.mutateAsync({ id: confirmDelete, audioUrl: dia?.audioUrl })
                  setConfirmDelete(null)
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-2">
        {dias?.length === 0 && (
          <p className="text-center text-stone-600 py-8 text-sm">No hay días creados aún.</p>
        )}
        {dias?.map((dia) => (
          <div
            key={dia.id}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-stone-100 hover:border-sage-200 transition group"
          >
            <div className="h-10 w-10 rounded-xl bg-sage-50 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-sage-600">{dia.dia}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-700 truncate">{dia.titulo}</p>
              <p className="text-xs text-stone-600 truncate">{dia.descripcion}</p>
            </div>
            {dia.audioUrl && (
              <Music className="h-4 w-4 text-sage-400 shrink-0" aria-label="Tiene audio" />
            )}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => setEditing(dia)}
                className="p-1.5 rounded-lg text-stone-600 hover:text-sage-600 hover:bg-sage-50 transition"
                title="Editar"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => setConfirmDelete(dia.id)}
                className="p-1.5 rounded-lg text-stone-600 hover:text-red-500 hover:bg-red-50 transition"
                title="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
