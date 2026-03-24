'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { Leaf } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

type Mode = 'login' | 'register'

const ERROR_MESSAGES: Record<string, string> = {
  'auth/user-not-found': 'No existe una cuenta con ese email.',
  'auth/wrong-password': 'Contraseña incorrecta.',
  'auth/invalid-credential': 'Credenciales incorrectas.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese email.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/invalid-email': 'El email no es válido.',
}

export default function LoginPage() {
  const { signIn, register, signInWithGoogle } = useAuth()
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleGoogle() {
    setError('')
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
      router.push('/admin')
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ''
      if (code !== 'auth/popup-closed-by-user') {
        setError(ERROR_MESSAGES[code] ?? 'No se pudo iniciar sesión con Google.')
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  function switchMode(next: Mode) {
    setMode(next)
    setError('')
    setConfirm('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (mode === 'register' && password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    try {
      if (mode === 'login') {
        await signIn(email, password)
      } else {
        await register(email, password)
      }
      router.push('/admin')
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ''
      setError(ERROR_MESSAGES[code] ?? 'Ocurrió un error. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-300 transition'

  return (
    <div className="min-h-dvh flex items-center justify-center px-4 bg-sage-50">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="h-14 w-14 rounded-2xl bg-sage-500 flex items-center justify-center mx-auto shadow-lg">
            <Leaf className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-stone-800">Panel de administración</h1>
          <p className="text-sm text-stone-600">Desafío Meditación 21 días</p>
        </div>

        {/* Tab toggle */}
        <div className="flex rounded-xl bg-stone-100 p-1 mb-4">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              mode === 'login' ? 'bg-white shadow text-stone-800' : 'text-stone-600'
            }`}
          >
            Ingresar
          </button>
          <button
            type="button"
            onClick={() => switchMode('register')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              mode === 'register' ? 'bg-white shadow text-stone-800' : 'text-stone-600'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 space-y-4"
        >
          <div className="space-y-1">
            <label className="text-sm font-medium text-stone-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ejemplo.com"
              required
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-stone-600">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className={inputClass}
            />
          </div>

          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-stone-600">Confirmar contraseña</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                required
                className={inputClass}
              />
            </div>
          )}

          {error && (
            <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-sage-500 hover:bg-sage-600 text-white font-semibold text-sm transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Spinner size="sm" /> : mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-stone-100" />
            <span className="text-xs text-stone-600">o</span>
            <div className="flex-1 h-px bg-stone-100" />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-sm font-medium transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {googleLoading ? (
              <Spinner size="sm" />
            ) : (
              <GoogleIcon />
            )}
            Continuar con Google
          </button>
        </form>
      </div>
    </div>
  )
}
