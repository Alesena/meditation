import { type NextRequest, NextResponse } from 'next/server'

// Firebase Auth uses client-side session cookies. Protection is handled
// inside app/admin/layout.tsx via a client-side redirect.
// This proxy is a stub for future server-side auth (Firebase Admin + session cookies).

export function proxy(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
