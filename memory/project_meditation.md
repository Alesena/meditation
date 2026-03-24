---
name: meditation-app-project
description: Desafío de meditación 23 días — arquitectura, stack y decisiones clave
type: project
---

App completa de desafío de meditación 23 días construida con Next.js 16 + Firebase.

**Why:** App personal para seguimiento de un reto de meditación de 23 días, con reproductor de audio, subida de fotos como evidencia y panel admin.

**Stack:**
- Next.js 16.2.1 (App Router, Turbopack, React 19)
- Tailwind CSS v4 (config vía @theme en globals.css, sin tailwind.config.js)
- Firebase: Firestore + Storage + Auth (lazy initialization — getters en lib/firebase/config.ts)
- TanStack Query v5 para server state
- react-hook-form + zod para formularios
- react-dropzone para subida de archivos
- Howler.js para reproductor de audio
- lucide-react para iconos

**Decisiones clave:**
- Firebase se inicializa lazy (getDb(), getStorageInstance(), getAuthInstance()) para evitar errores SSR durante prerendering
- `export const dynamic = 'force-dynamic'` en todas las páginas con Firebase
- Next.js 16 usa "proxy.ts" en vez de "middleware.ts"
- En Next.js 16, params y searchParams en Server Components deben ser awaited
- Tailwind v4: colores definidos en @theme como --color-sage-500, usados como bg-sage-500
- Auth del admin es client-side (useAuth hook con Firebase Auth) — la protección de rutas está en app/admin/layout.tsx
- Sin multi-usuario real — userId hardcoded como 'usuario-1' (listo para extender con Auth)

**Estructura Firestore:**
- /dias/{id}: dia, titulo, audioUrl, descripcion, tarea, fraseDelDia, createdAt
- /entregas/{id}: dia, evidenciaUrl, reflexion, comentario, completado, fechaEntrega, userId

**How to apply:** Al agregar features, mantener el patrón lazy de Firebase. Al agregar rutas con Firebase, añadir force-dynamic. Para colores nuevos, agregarlos al @theme en globals.css.

**Pendiente para el usuario:**
1. Crear archivo .env.local con credenciales Firebase (ver .env.local.example)
2. Crear proyecto en Firebase Console, habilitar Firestore, Storage y Auth (email/password)
3. Configurar reglas de Firestore/Storage
4. Crear usuario admin en Firebase Auth Console
5. Copiar íconos PWA (icon-192.png, icon-512.png) a /public/
