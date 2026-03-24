'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'

interface EvidenceUploadProps {
  onFileSelect: (file: File | null) => void
  existingUrl?: string
}

export function EvidenceUpload({ onFileSelect, existingUrl }: EvidenceUploadProps) {
  const [preview, setPreview] = useState<string | null>(existingUrl ?? null)

  const onDrop = useCallback(
    (accepted: File[]) => {
      const file = accepted[0]
      if (!file) return
      const url = URL.createObjectURL(file)
      setPreview(url)
      onFileSelect(file)
    },
    [onFileSelect]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  function clear(e: React.MouseEvent) {
    e.stopPropagation()
    setPreview(null)
    onFileSelect(null)
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-stone-600">Foto de evidencia</label>

      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-sage-200">
          <div className="relative h-48 w-full">
            <Image src={preview} alt="Evidencia" fill className="object-cover" />
          </div>
          <button
            type="button"
            onClick={clear}
            className="absolute top-2 right-2 h-7 w-7 flex items-center justify-center rounded-full bg-white/90 shadow text-stone-600 hover:bg-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center gap-2 h-32 rounded-xl border-2 border-dashed cursor-pointer transition-colors
            ${isDragActive ? 'border-sage-400 bg-sage-50' : 'border-stone-200 hover:border-sage-300 hover:bg-stone-50'}`}
        >
          <input {...getInputProps()} />
          <Upload className="h-6 w-6 text-stone-400" />
          <p className="text-sm text-stone-400 text-center">
            {isDragActive ? 'Suelta la imagen aquí' : 'Arrastra una foto o toca para seleccionar'}
          </p>
        </div>
      )}
    </div>
  )
}
