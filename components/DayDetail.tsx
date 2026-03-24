'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { entregaSchema, type EntregaSchemaType } from '@/lib/validations/schemas'
import { useEntregaByDia } from '@/lib/hooks/useEntregas'
import { useSubmitEntrega } from '@/lib/hooks/useEntregas'
import { AudioPlayer } from './AudioPlayer'
import { EvidenceUpload } from './EvidenceUpload'
import { Spinner } from './ui/Spinner'
import { getFraseAleatoria } from '@/lib/utils/format'
import type { Dia } from '@/lib/types'
import { CheckCircle, BookOpen, Leaf, Quote } from 'lucide-react'
import { FormattedText } from './ui/FormattedText'

export function DayDetail({ dia }: { dia: Dia }) {
  const { data: entrega, isLoading: loadingEntrega } = useEntregaByDia(dia.dia)
  const submitEntrega = useSubmitEntrega()
  const [evidenciaFile, setEvidenciaFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [success, setSuccess] = useState(false)
  const [frase] = useState(getFraseAleatoria)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EntregaSchemaType>({
    resolver: zodResolver(entregaSchema),
    defaultValues: {
      reflexion: entrega?.reflexion ?? '',
      comentario: entrega?.comentario ?? '',
    },
  })

  async function onSubmit(values: EntregaSchemaType) {
    try {
      await submitEntrega.mutateAsync({
        dia: dia.dia,
        reflexion: values.reflexion,
        comentario: values.comentario,
        evidenciaFile: evidenciaFile ?? undefined,
        existingId: entrega?.id,
        onProgress: setUploadProgress,
      })
      setSuccess(true)
      setEvidenciaFile(null)
      setUploadProgress(0)
      setTimeout(() => setSuccess(false), 4000)
    } catch (err) {
      console.error(err)
    }
  }

  if (loadingEntrega) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    )
  }

  const isCompleted = entrega?.completado

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-sage-500">
            Día {dia.dia}
          </span>
          {isCompleted && <CheckCircle className="h-4 w-4 text-sage-500" />}
        </div>
        <h2 className="text-2xl font-bold text-stone-800">{dia.titulo}</h2>
      </div>

      {/* Audio player */}
      {dia.audioUrl && (
        <AudioPlayer src={dia.audioUrl} titulo={dia.titulo} />
      )}

      {/* Description */}
      <div className="bg-beige-50 rounded-2xl p-4 border border-beige-100 space-y-2">
        <div className="flex items-center gap-2 text-stone-500">
          <Leaf className="h-4 w-4 text-sage-500" />
          <span className="text-xs font-semibold uppercase tracking-wide">Descripción</span>
        </div>
        <FormattedText text={dia.descripcion} className="text-stone-700" />
      </div>

      {/* Tarea */}
      <div className="bg-lavender-50 rounded-2xl p-4 border border-lavender-100 space-y-2">
        <div className="flex items-center gap-2 text-stone-500">
          <BookOpen className="h-4 w-4 text-lavender-500" />
          <span className="text-xs font-semibold uppercase tracking-wide">Tarea del día</span>
        </div>
        <FormattedText text={dia.tarea} className="text-stone-700" />
      </div>

      {/* Frase del día */}
      {dia.fraseDelDia && (
        <div className="rounded-2xl p-4 bg-gradient-to-br from-lavender-100 to-sage-50 border border-lavender-100 flex gap-3">
          <Quote className="h-5 w-5 text-lavender-400 shrink-0 mt-0.5" />
          <p className="text-stone-600 italic text-sm leading-relaxed">{dia.fraseDelDia}</p>
        </div>
      )}

      {/* Formulario de entrega */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-stone-600">
            Tu reflexión del día
          </label>
          <textarea
            {...register('reflexion')}
            rows={4}
            placeholder="¿Qué sentiste? ¿Qué descubriste hoy?"
            className="w-full rounded-xl border border-stone-200 p-3 text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-300 resize-none transition"
          />
          {errors.reflexion && (
            <p className="text-xs text-red-400">{errors.reflexion.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-stone-600">
            Comentario adicional <span className="text-stone-400">(opcional)</span>
          </label>
          <input
            {...register('comentario')}
            type="text"
            placeholder="Algo más que quieras compartir..."
            className="w-full rounded-xl border border-stone-200 p-3 text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-300 transition"
          />
        </div>

        <EvidenceUpload
          onFileSelect={setEvidenciaFile}
          existingUrl={entrega?.evidenciaUrl}
        />

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-stone-400">
              <span>Subiendo...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <div className="h-1.5 bg-stone-100 rounded-full">
              <div
                className="h-full bg-sage-400 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-xl bg-sage-500 hover:bg-sage-600 text-white font-semibold text-sm shadow-sm transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" />
              <span>Guardando...</span>
            </>
          ) : isCompleted ? (
            'Actualizar entrega'
          ) : (
            '✓ Marcar como completado'
          )}
        </button>
      </form>

      {/* Success message */}
      {success && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-sage-600 text-white text-sm px-6 py-3 rounded-2xl shadow-lg animate-bounce z-50 max-w-xs text-center">
          {frase}
        </div>
      )}
    </div>
  )
}
