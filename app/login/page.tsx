'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { Leaf } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'

export default function LoginPage() {
  const { signIn } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      router.push('/admin')
    } catch {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-4 bg-sage-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8 space-y-2">
          <div className="h-14 w-14 rounded-2xl bg-sage-500 flex items-center justify-center mx-auto shadow-lg">
            <Leaf className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-stone-800">Panel de administración</h1>
          <p className="text-sm text-stone-500">Desafío Meditación 23 días</p>
        </div>

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
              className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-300 transition"
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
              className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-300 transition"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-sage-500 hover:bg-sage-600 text-white font-semibold text-sm transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Spinner size="sm" /> : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
