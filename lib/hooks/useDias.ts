'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { getDb } from '@/lib/firebase/config'
import { uploadFile, extractPathFromUrl, getSupabase, BUCKET, FOLDERS } from '@/lib/supabase/client'
import type { Dia, DiaFormData } from '@/lib/types'

const COLLECTION = 'dias'

export function useDias() {
  return useQuery({
    queryKey: ['dias'],
    queryFn: async (): Promise<Dia[]> => {
      const db = getDb()
      const q = query(collection(db, COLLECTION), orderBy('dia', 'asc'))
      const snapshot = await getDocs(q)
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Dia))
    },
  })
}

export function useDia(id: string | null) {
  return useQuery({
    queryKey: ['dias', id],
    queryFn: async (): Promise<Dia | null> => {
      if (!id) return null
      const db = getDb()
      const snap = await getDoc(doc(db, COLLECTION, id))
      if (!snap.exists()) return null
      return { id: snap.id, ...snap.data() } as Dia
    },
    enabled: !!id,
  })
}

async function uploadAudio(file: File, diaNum: number): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'mp3'
  const contentType = file.type || (['mpeg', 'mpg', 'mp3'].includes(ext) ? 'audio/mpeg' : `audio/${ext}`)
  const filename = `dia-${diaNum}-${Date.now()}.${ext}`
  return uploadFile(FOLDERS.AUDIOS, filename, file, contentType)
}

async function deleteFile(url: string) {
  const path = extractPathFromUrl(url)
  if (!path) return
  await getSupabase().storage.from(BUCKET).remove([path])
}

async function uploadVideo(file: File, diaNum: number): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'mp4'
  const contentType = file.type || `video/${ext}`
  const filename = `dia-${diaNum}-${Date.now()}.${ext}`
  return uploadFile(FOLDERS.VIDEOS, filename, file, contentType)
}

export function useCreateDia() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      data,
      audioFile,
      videoFile,
    }: {
      data: DiaFormData
      audioFile?: File
      videoFile?: File
      onProgress?: (p: number) => void
    }) => {
      const db = getDb()
      const audioUrl = audioFile ? await uploadAudio(audioFile, data.dia) : ''
      const videoUrl = videoFile ? await uploadVideo(videoFile, data.dia) : ''
      await addDoc(collection(db, COLLECTION), {
        ...data,
        audioUrl,
        ...(videoUrl && { videoUrl }),
        createdAt: serverTimestamp(),
      })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dias'] }),
  })
}

export function useUpdateDia() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      data,
      audioFile,
      videoFile,
      oldAudioUrl,
      oldVideoUrl,
    }: {
      id: string
      data: Partial<DiaFormData>
      audioFile?: File
      videoFile?: File
      oldAudioUrl?: string
      oldVideoUrl?: string
      onProgress?: (p: number) => void
    }) => {
      const db = getDb()
      const updates: Record<string, unknown> = { ...data }
      if (audioFile) {
        if (oldAudioUrl) await deleteFile(oldAudioUrl)
        updates.audioUrl = await uploadAudio(audioFile, data.dia ?? 0)
      }
      if (videoFile) {
        if (oldVideoUrl) await deleteFile(oldVideoUrl)
        updates.videoUrl = await uploadVideo(videoFile, data.dia ?? 0)
      }
      await updateDoc(doc(db, COLLECTION, id), updates)
    },
    onSuccess: (_d, { id }) => {
      qc.invalidateQueries({ queryKey: ['dias'] })
      qc.invalidateQueries({ queryKey: ['dias', id] })
    },
  })
}

export function useDeleteDia() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, audioUrl, videoUrl }: { id: string; audioUrl?: string; videoUrl?: string }) => {
      const db = getDb()
      if (audioUrl) await deleteFile(audioUrl)
      if (videoUrl) await deleteFile(videoUrl)
      await deleteDoc(doc(db, COLLECTION, id))
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dias'] }),
  })
}
