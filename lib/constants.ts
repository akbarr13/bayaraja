export const COLORS = {
  primary: '#2563EB',
  secondary: '#3B82F6',
  cta: '#F97316',
  bg: '#F8FAFC',
  text: '#1E293B',
} as const

export const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Dikonfirmasi', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Ditolak', color: 'bg-red-100 text-red-800' },
}

export const LIMITS = {
  maxQrisAccounts: 10,
  maxPaymentLinks: 100,
  maxApiKeys: 5,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  rateLimit: {
    paymentProof: { max: 5, windowSeconds: 600 },
    paymentProofPerLink: { max: 3, windowSeconds: 600 },
    createAmount: { max: 60, windowSeconds: 60 },
    publicPay: { max: 30, windowSeconds: 60 },
    authenticated: { max: 30, windowSeconds: 60 },
  },
  pendingPerLink: 30,
} as const

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const

export const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}
