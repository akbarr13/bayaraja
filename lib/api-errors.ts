import { NextResponse } from 'next/server'

export const ApiError = {
  unauthorized: () =>
    NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),

  forbidden: () =>
    NextResponse.json({ error: 'Forbidden' }, { status: 403 }),

  notFound: (msg = 'Not found') =>
    NextResponse.json({ error: msg }, { status: 404 }),

  badRequest: (msg: string, details?: unknown) =>
    NextResponse.json({ error: msg, ...(details ? { details } : {}) }, { status: 400 }),

  tooManyRequests: () =>
    NextResponse.json(
      { error: 'Terlalu banyak request.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    ),

  serverError: (msg = 'Server error') =>
    NextResponse.json({ error: msg }, { status: 500 }),

  gone: (msg: string) =>
    NextResponse.json({ error: msg }, { status: 410 }),

  conflict: (msg: string) =>
    NextResponse.json({ error: msg }, { status: 409 }),
}
