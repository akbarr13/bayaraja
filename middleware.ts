import { updateSession } from '@/lib/supabase/middleware'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|pay/|api/pay/|api/qris/create-amount|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).+)',
  ],
}
