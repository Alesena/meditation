'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  where,
} from 'firebase/firestore'
import { getDb } from '@/lib/firebase/config'
import { getSupabase, getPublicUrl, BUCKETS } from '@/lib/supabase/client'
import type { Entrega } from '@/lib/types'

const COLLECTION = 'entregas'
const DEFAULT_USER = 'usuario-1'

export function useEntregas() {
  return useQuery({
    queryKey: ['entregas'],
    queryFn: async (): Promise<Entrega[]> => {
      const db = getDb()
      const q = query(collection(db, COLLECTION), orderBy('dia', 'asc'))
      const snapshot = await getDocs(q)
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Entrega))
    },
  })
}

export function useEntregaByDia(dia: number) {
  return useQuery({
    queryKey: ['entregas', 'dia', dia],
    queryFn: async (): Promise<Entrega | null> => {
      const db = getDb()
      const q = query(
        collection(db, COLLECTION),
        where('dia', '==', dia),
        where('userId', '==', DEFAULT_USER)
      )
      const snap = await getDocs(q)
      if (snap.empty) return null
      const d = snap.docs[0]
      return { id: d.id, ...d.data() } as Entrega
    },
    enabled: dia > 0,
  })
}

async function uploadEvidencia(file: File, dia: number): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const path = `dia-${dia}-${Date.now()}.${ext}`

  const { error } = await getSupabase()
    .storage
    .from(BUCKETS.EVIDENCIAS)
    .upload(path, file, { contentType: file.type, upsert: true })

  if (error) throw new Error(error.message)
  return getPublicUrl(BUCKETS.EVIDENCIAS, path)
}

export function useSubmitEntrega() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      dia,
      reflexion,
      comentario,
      evidenciaFile,
      existingId,
    }: {
      dia: number
      reflexion: string
      comentario?: string
      evidenciaFile?: File
      existingId?: string
      onProgress?: (p: number) => void  // mantenido por compatibilidad de interfaz
    }) => {
      const db = getDb()
      const evidenciaUrl = evidenciaFile ? await uploadEvidencia(evidenciaFile, dia) : ''

      const payload = {
        dia,
        reflexion,
        comentario: comentario ?? '',
        evidenciaUrl,
        completado: true,
        fechaEntrega: serverTimestamp(),
        userId: DEFAULT_USER,
      }

      if (existingId) {
        await updateDoc(doc(db, COLLECTION, existingId), payload)
      } else {
        await addDoc(collection(db, COLLECTION), payload)
      }
    },
    onSuccess: (_d, { dia }) => {
      qc.invalidateQueries({ queryKey: ['entregas'] })
      qc.invalidateQueries({ queryKey: ['entregas', 'dia', dia] })
    },
  })
}
