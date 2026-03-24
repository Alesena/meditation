'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { Leaf } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'

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
  const { signIn, register } = useAuth()
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
          <p className="text-sm text-stone-500">Desafío Meditación 23 días</p>
        </div>

        {/* Tab toggle */}
        <div className="flex rounded-xl bg-stone-100 p-1 mb-4">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              mode === 'login' ? 'bg-white shadow text-stone-800' : 'text-stone-500'
            }`}
          >
            Ingresar
          </button>
          <button
            type="button"
            onClick={() => switchMode('register')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              mode === 'register' ? 'bg-white shadow text-stone-800' : 'text-stone-500'
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
        </form>
      </div>
    </div>
  )
}
