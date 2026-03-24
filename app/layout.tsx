import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { QueryProvider } from '@/lib/providers/QueryProvider'
import './globals.css'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Desafío Meditación 23 Días',
  description: 'Tu viaje de 23 días hacia la paz interior y la consciencia plena',
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geist.variable} h-full`}>
      <body className="min-h-dvh flex flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
