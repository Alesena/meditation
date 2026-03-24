import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _client
}

// Un solo bucket público con subcarpetas
export const BUCKET = 'meditation'

export const FOLDERS = {
  AUDIOS: 'audios',
  EVIDENCIAS: 'evidencias',
} as const

/** Devuelve la URL pública de un archivo en Supabase Storage */
export function getPublicUrl(path: string): string {
  return getSupabase().storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

/**
 * Extrae el path relativo a partir de la URL pública de Supabase.
 * Ej: https://xxx.supabase.co/storage/v1/object/public/meditation/audios/dia-1.mp3 → "audios/dia-1.mp3"
 */
export function extractPathFromUrl(url: string): string | null {
  const marker = `/object/public/${BUCKET}/`
  const idx = url.indexOf(marker)
  if (idx < 0) return null
  return decodeURIComponent(url.slice(idx + marker.length).split('?')[0])
}

/**
 * Sube un archivo al bucket. Si el bucket no existe lo crea automáticamente.
 */
export async function uploadFile(
  folder: string,
  filename: string,
  file: File,
  contentType: string
): Promise<string> {
  const supabase = getSupabase()
  const path = `${folder}/${filename}`

  let { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType, upsert: true })

  // Si el bucket no existe, lo creamos e intentamos de nuevo
  if (error?.message === 'Bucket not found') {
    const { error: createError } = await supabase.storage.createBucket(BUCKET, {
      public: true,
      allowedMimeTypes: ['audio/*', 'image/*'],
    })
    if (createError && createError.message !== 'Bucket already exists') {
      throw new Error(`No se pudo crear el bucket: ${createError.message}`)
    }
    const retry = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType, upsert: true })
    error = retry.error
  }

  if (error) throw new Error(error.message)
  return getPublicUrl(path)
}
