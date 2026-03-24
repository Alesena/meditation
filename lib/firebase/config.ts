import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'
import { getAuth, type Auth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Lazy singletons — only initialise on first access (always client-side)
let _app: FirebaseApp | null = null
let _db: Firestore | null = null
let _storage: FirebaseStorage | null = null
let _auth: Auth | null = null

function app(): FirebaseApp {
  if (!_app) {
    _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  }
  return _app
}

export function getDb(): Firestore {
  if (!_db) _db = getFirestore(app())
  return _db
}

export function getStorageInstance(): FirebaseStorage {
  if (!_storage) _storage = getStorage(app())
  return _storage
}

export function getAuthInstance(): Auth {
  if (!_auth) _auth = getAuth(app())
  return _auth
}
