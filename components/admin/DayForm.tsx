'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDropzone } from 'react-dropzone'
import { diaSchema, type DiaSchemaType } from '@/lib/validations/schemas'
import { useCreateDia, useUpdateDia } from '@/lib/hooks/useDias'
import { Spinner } from '@/components/ui/Spinner'
import type { Dia } from '@/lib/types'
import { Music, X } from 'lucide-react'

interface DayFormProps {
  dia?: Dia
  onClose: () => void
}

export function DayForm({ dia, onClose }: DayFormProps) {
  const createDia = useCreateDia()
  const updateDia = useUpdateDia()
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DiaSchemaType>({
    resolver: zodResolver(diaSchema) as never,
    defaultValues: dia
      ? {
          dia: dia.dia,
          titulo: dia.titulo,
          descripcion: dia.descripcion,
          tarea: dia.tarea,
          fraseDelDia: dia.fraseDelDia ?? '',
        }
      : undefined,
  })

  const onDropAudio = useCallback((files: File[]) => {
    if (files[0]) setAudioFile(files[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropAudio,
    accept: { 'audio/*': [] },
    maxFiles: 1,
  })

  async function onSubmit(values: unknown) {
    const v = values as DiaSchemaType
    try {
      if (dia) {
        await updateDia.mutateAsync({
          id: dia.id,
          data: v,
          audioFile: audioFile ?? undefined,
          oldAudioUrl: dia.audioUrl,
          onProgress: setProgress,
        })
      } else {
        await createDia.mutateAsync({
          data: v,
          audioFile: audioFile ?? undefined,
          onProgress: setProgress,
        })
      }
      onClose()
    } catch (err) {
      console.error(err)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-stone-200 p-3 text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-300 transition'
  const labelClass = 'block text-sm font-medium text-stone-600 mb-1'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Número de día</label>
          <input type="number" {...register('dia')} className={inputClass} min={1} max={23} />
          {errors.dia && <p className="text-xs text-red-400 mt-1">{errors.dia.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Título</label>
          <input type="text" {...register('titulo')} className={inputClass} placeholder="Consciencia plena" />
          {errors.titulo && <p className="text-xs text-red-400 mt-1">{errors.titulo.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Descripción</label>
        <textarea {...register('descripcion')} rows={3} className={inputClass} placeholder="Descripción del día..." />
        {errors.descripcion && <p className="text-xs text-red-400 mt-1">{errors.descripcion.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Tarea del día</label>
        <textarea {...register('tarea')} rows={2} className={inputClass} placeholder="La tarea de hoy es..." />
        {errors.tarea && <p className="text-xs text-red-400 mt-1">{errors.tarea.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Frase del día <span className="text-stone-400">(opcional)</span></label>
        <input type="text" {...register('fraseDelDia')} className={inputClass} placeholder="Una frase inspiradora..." />
      </div>

      {/* Audio upload */}
      <div>
        <label className={labelClass}>Audio de meditación</label>
        {audioFile ? (
          <div className="flex items-center gap-3 p-3 bg-sage-50 rounded-xl border border-sage-200">
            <Music className="h-5 w-5 text-sage-500 shrink-0" />
            <span className="text-sm text-stone-600 truncate flex-1">{audioFile.name}</span>
            <button type="button" onClick={() => setAudioFile(null)}>
              <X className="h-4 w-4 text-stone-400 hover:text-stone-600" />
            </button>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center gap-2 h-24 rounded-xl border-2 border-dashed cursor-pointer transition-colors
              ${isDragActive ? 'border-sage-400 bg-sage-50' : 'border-stone-200 hover:border-sage-300'}`}
          >
            <input {...getInputProps()} />
            <Music className="h-5 w-5 text-stone-400" />
            <p className="text-xs text-stone-400">
              {dia?.audioUrl ? 'Reemplazar audio (arrastra o selecciona)' : 'Sube el audio de meditación'}
            </p>
          </div>
        )}
        {dia?.audioUrl && !audioFile && (
          <p className="text-xs text-stone-400 mt-1">✓ Ya tiene audio. Sube uno nuevo para reemplazarlo.</p>
        )}
      </div>

      {progress > 0 && progress < 100 && (
        <div>
          <div className="h-1.5 bg-stone-100 rounded-full">
            <div className="h-full bg-sage-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-stone-400 mt-1">Subiendo... {Math.round(progress)}%</p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-sm hover:bg-stone-50 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-2.5 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-sm font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isSubmitting ? <Spinner size="sm" /> : dia ? 'Guardar cambios' : 'Crear día'}
        </button>
      </div>
    </form>
  )
}
