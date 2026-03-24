'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDropzone } from 'react-dropzone'
import { z } from 'zod'
import { diaSchema, type DiaSchemaType } from '@/lib/validations/schemas'

type DiaFormInput = z.input<typeof diaSchema>
import { useCreateDia, useUpdateDia } from '@/lib/hooks/useDias'
import { Spinner } from '@/components/ui/Spinner'
import type { Dia } from '@/lib/types'
import { Music, Video, X } from 'lucide-react'

interface DayFormProps {
  dia?: Dia
  onClose: () => void
}

export function DayForm({ dia, onClose }: DayFormProps) {
  const createDia = useCreateDia()
  const updateDia = useUpdateDia()
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DiaFormInput, unknown, DiaSchemaType>({
    resolver: zodResolver(diaSchema),
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

  const onDropVideo = useCallback((files: File[]) => {
    if (files[0]) setVideoFile(files[0])
  }, [])

  const audioDropzone = useDropzone({
    onDrop: onDropAudio,
    accept: {
      'audio/mpeg': ['.mp3', '.mpeg', '.mpg'],
      'audio/mp4': ['.m4a'],
      'audio/ogg': ['.ogg', '.oga'],
      'audio/wav': ['.wav'],
      'audio/webm': ['.webm'],
      'audio/aac': ['.aac'],
    },
    maxFiles: 1,
  })

  const videoDropzone = useDropzone({
    onDrop: onDropVideo,
    accept: {
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm'],
      'video/ogg': ['.ogv'],
      'video/quicktime': ['.mov'],
    },
    maxFiles: 1,
  })

  async function onSubmit(values: DiaSchemaType) {
    setError('')
    try {
      if (dia) {
        await updateDia.mutateAsync({
          id: dia.id,
          data: values,
          audioFile: audioFile ?? undefined,
          videoFile: videoFile ?? undefined,
          oldAudioUrl: dia.audioUrl,
          oldVideoUrl: dia.videoUrl,
        })
      } else {
        await createDia.mutateAsync({
          data: values,
          audioFile: audioFile ?? undefined,
          videoFile: videoFile ?? undefined,
        })
      }
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
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
          <input type="number" {...register('dia')} className={inputClass} min={1} max={21} />
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
        <textarea {...register('descripcion')} rows={4} className={`${inputClass} resize-y`} placeholder="Descripción del día..." />
        {errors.descripcion && <p className="text-xs text-red-400 mt-1">{errors.descripcion.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Tarea del día</label>
        <textarea {...register('tarea')} rows={8} className={`${inputClass} resize-y`} placeholder={`La tarea de hoy es...\n\nPuedes usar:\n1. Listas numeradas\n- Viñetas\n**negrita**`} />
        {errors.tarea && <p className="text-xs text-red-400 mt-1">{errors.tarea.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Frase del día <span className="text-stone-600">(opcional)</span></label>
        <input type="text" {...register('fraseDelDia')} className={inputClass} placeholder="Una frase inspiradora..." />
      </div>

      {/* Audio */}
      <FileDropField
        label="Audio de meditación"
        icon={<Music className="h-5 w-5 text-stone-600" />}
        file={audioFile}
        onClear={() => setAudioFile(null)}
        existingUrl={dia?.audioUrl}
        existingLabel="Ya tiene audio"
        dropzone={audioDropzone}
        hint="MP3, MPEG, WAV, AAC..."
      />

      {/* Video — opcional */}
      <FileDropField
        label="Video"
        optional
        icon={<Video className="h-5 w-5 text-stone-600" />}
        file={videoFile}
        onClear={() => setVideoFile(null)}
        existingUrl={dia?.videoUrl}
        existingLabel="Ya tiene video"
        dropzone={videoDropzone}
        hint="MP4, WebM, MOV..."
      />

      {error && (
        <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
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

/* Subcomponente reutilizable para audio y video */
function FileDropField({
  label, optional, icon, file, onClear, existingUrl, existingLabel, dropzone, hint,
}: {
  label: string
  optional?: boolean
  icon: React.ReactNode
  file: File | null
  onClear: () => void
  existingUrl?: string
  existingLabel: string
  dropzone: ReturnType<typeof useDropzone>
  hint: string
}) {
  const { getRootProps, getInputProps, isDragActive } = dropzone
  return (
    <div>
      <label className="block text-sm font-medium text-stone-600 mb-1">
        {label}{optional && <span className="text-stone-500 font-normal"> (opcional)</span>}
      </label>
      {file ? (
        <div className="flex items-center gap-3 p-3 bg-sage-50 rounded-xl border border-sage-200">
          {icon}
          <span className="text-sm text-stone-600 truncate flex-1">{file.name}</span>
          <button type="button" onClick={onClear}>
            <X className="h-4 w-4 text-stone-600 hover:text-red-500 transition" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center gap-2 h-20 rounded-xl border-2 border-dashed cursor-pointer transition-colors
            ${isDragActive ? 'border-sage-400 bg-sage-50' : 'border-stone-200 hover:border-sage-300'}`}
        >
          <input {...getInputProps()} />
          <div className="flex items-center gap-2 text-stone-600">
            {icon}
            <p className="text-xs">{hint}</p>
          </div>
        </div>
      )}
      {existingUrl && !file && (
        <p className="text-xs text-stone-600 mt-1">✓ {existingLabel}. Sube uno nuevo para reemplazarlo.</p>
      )}
    </div>
  )
}
