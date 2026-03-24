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
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { getDb, getStorageInstance } from '@/lib/firebase/config'
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

async function uploadAudio(
  file: File,
  diaNum: number,
  onProgress?: (p: number) => void
): Promise<string> {
  const storage = getStorageInstance()
  const storageRef = ref(storage, `audios/dia-${diaNum}-${Date.now()}.${file.name.split('.').pop()}`)
  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file)
    task.on(
      'state_changed',
      (snap) => onProgress?.((snap.bytesTransferred / snap.totalBytes) * 100),
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        resolve(url)
      }
    )
  })
}

export function useCreateDia() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      data,
      audioFile,
      onProgress,
    }: {
      data: DiaFormData
      audioFile?: File
      onProgress?: (p: number) => void
    }) => {
      const db = getDb()
      let audioUrl = ''
      if (audioFile) {
        audioUrl = await uploadAudio(audioFile, data.dia, onProgress)
      }
      await addDoc(collection(db, COLLECTION), {
        ...data,
        audioUrl,
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
      oldAudioUrl,
      onProgress,
    }: {
      id: string
      data: Partial<DiaFormData>
      audioFile?: File
      oldAudioUrl?: string
      onProgress?: (p: number) => void
    }) => {
      const db = getDb()
      const storage = getStorageInstance()
      const updates: Record<string, unknown> = { ...data }
      if (audioFile) {
        if (oldAudioUrl) {
          try { await deleteObject(ref(storage, oldAudioUrl)) } catch { /* ignore */ }
        }
        updates.audioUrl = await uploadAudio(audioFile, data.dia ?? 0, onProgress)
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
    mutationFn: async ({ id, audioUrl }: { id: string; audioUrl?: string }) => {
      const db = getDb()
      const storage = getStorageInstance()
      if (audioUrl) {
        try { await deleteObject(ref(storage, audioUrl)) } catch { /* ignore */ }
      }
      await deleteDoc(doc(db, COLLECTION, id))
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dias'] }),
  })
}
