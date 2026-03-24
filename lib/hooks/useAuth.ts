'use client'

import { useState, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { getAuthInstance } from '@/lib/firebase/config'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getAuthInstance()
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  async function signIn(email: string, password: string) {
    return signInWithEmailAndPassword(getAuthInstance(), email, password)
  }

  async function register(email: string, password: string) {
    return createUserWithEmailAndPassword(getAuthInstance(), email, password)
  }

  async function signOut() {
    return firebaseSignOut(getAuthInstance())
  }

  return { user, loading, signIn, register, signOut }
}
