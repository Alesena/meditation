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

// Script que se ejecuta antes de React para evitar flash de tema incorrecto
const themeScript = `
  try {
    const t = localStorage.getItem('meditation-theme')
    if (t === 'dark') document.documentElement.classList.add('dark')
  } catch(e) {}
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geist.variable} h-full`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh flex flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
