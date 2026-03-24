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

export const BUCKETS = {
  AUDIOS: 'audios',
  EVIDENCIAS: 'evidencias',
} as const

/** Devuelve la URL pública de un archivo en Supabase Storage */
export function getPublicUrl(bucket: string, path: string): string {
  return getSupabase().storage.from(bucket).getPublicUrl(path).data.publicUrl
}

/**
 * Extrae el path relativo del bucket a partir de la URL pública de Supabase.
 * Ej: https://xxx.supabase.co/storage/v1/object/public/audios/dia-1.mp3 → "dia-1.mp3"
 */
export function extractPathFromUrl(url: string, bucket: string): string | null {
  const marker = `/object/public/${bucket}/`
  const idx = url.indexOf(marker)
  if (idx < 0) return null
  return decodeURIComponent(url.slice(idx + marker.length).split('?')[0])
}
