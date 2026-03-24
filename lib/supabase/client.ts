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
  VIDEOS: 'videos',
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
 * Sube un archivo al bucket 'meditation'.
 * El bucket debe existir previamente en Supabase Dashboard → Storage.
 */
export async function uploadFile(
  folder: string,
  filename: string,
  file: File,
  contentType: string
): Promise<string> {
  const path = `${folder}/${filename}`

  const { error } = await getSupabase()
    .storage
    .from(BUCKET)
    .upload(path, file, { contentType, upsert: true })

  if (error) {
    if (error.message === 'Bucket not found') {
      throw new Error(
        'El bucket "meditation" no existe. Créalo en Supabase Dashboard → Storage → New bucket (nombre: meditation, público: sí).'
      )
    }
    throw new Error(error.message)
  }

  return getPublicUrl(path)
}
