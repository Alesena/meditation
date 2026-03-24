'use client'

import { useEntregas } from '@/lib/hooks/useEntregas'
import { Spinner } from '@/components/ui/Spinner'
import Image from 'next/image'
import { CheckCircle, Calendar } from 'lucide-react'
import type { Timestamp } from 'firebase/firestore'

function formatDate(ts: Timestamp | undefined) {
  if (!ts) return '—'
  return ts.toDate().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function SubmissionsList() {
  const { data: entregas, isLoading } = useEntregas()

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
        <h2 className="text-lg font-semibold text-stone-700">Entregas</h2>
        <span className="text-sm text-stone-600">
          {entregas?.filter((e) => e.completado).length ?? 0} completadas
        </span>
      </div>

      {entregas?.length === 0 && (
        <p className="text-center text-stone-600 py-8 text-sm">Sin entregas todavía.</p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {entregas?.map((entrega) => (
          <div
            key={entrega.id}
            className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm"
          >
            {entrega.evidenciaUrl && (
              <div className="relative h-40">
                <Image
                  src={entrega.evidenciaUrl}
                  alt={`Evidencia día ${entrega.dia}`}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-sage-600">Día {entrega.dia}</span>
                {entrega.completado && (
                  <CheckCircle className="h-4 w-4 text-sage-500" />
                )}
              </div>
              {entrega.reflexion && (
                <p className="text-xs text-stone-600 line-clamp-3">{entrega.reflexion}</p>
              )}
              <div className="flex items-center gap-1 text-xs text-stone-600">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(entrega.fechaEntrega as Timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
