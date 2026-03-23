import { z } from 'zod'

export const qrisAccountSchema = z.object({
  label: z
    .string()
    .min(1, 'Label wajib diisi')
    .max(100, 'Label maksimal 100 karakter'),
  qris_string: z
    .string()
    .min(50, 'QRIS string terlalu pendek')
    .max(500, 'QRIS string terlalu panjang')
    .refine((s) => s.includes('010211') || s.includes('010212'), {
      message: 'Format QRIS tidak valid',
    })
    .refine((s) => s.includes('5802ID'), {
      message: 'QRIS harus memiliki country code Indonesia (5802ID)',
    }),
  merchant_name: z.string().max(100).nullable().optional(),
  is_default: z.boolean().optional(),
})

export const paymentLinkSchema = z.object({
  qris_account_id: z.string().uuid('QRIS account tidak valid'),
  title: z
    .string()
    .min(1, 'Judul wajib diisi')
    .max(200, 'Judul maksimal 200 karakter'),
  description: z.string().max(500).nullable().optional(),
  amount: z
    .number()
    .int('Nominal harus bilangan bulat')
    .min(1, 'Nominal minimal Rp 1')
    .max(99999999, 'Nominal terlalu besar'),
  is_single_use: z.boolean().optional(),
  expires_at: z.string().nullable().optional(),
})

export const transactionStatusSchema = z.object({
  status: z.enum(['confirmed', 'rejected']),
  notes: z.string().max(500).nullable().optional(),
})

export const apiKeySchema = z.object({
  label: z
    .string()
    .min(1, 'Label wajib diisi')
    .max(100, 'Label maksimal 100 karakter'),
})

export const createAmountSchema = z.object({
  qris_account_id: z.string().uuid().optional(),
  amount: z
    .number()
    .int('Nominal harus bilangan bulat')
    .min(1, 'Nominal minimal Rp 1')
    .max(99999999, 'Nominal terlalu besar'),
})

export const paymentProofSchema = z.object({
  payment_link_id: z.string().uuid(),
  payer_name: z.string().max(100).nullable().optional(),
  payer_email: z.string().email().max(200).nullable().optional(),
})

export const linkPatchSchema = z.object({
  is_active: z.boolean(),
})

/** Block SSRF: reject localhost, private IPs, and non-HTTPS URLs */
const PRIVATE_HOSTNAME_RE = /^(localhost|127\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|192\.168\.\d+\.\d+|0\.0\.0\.0|\[::1?\])$/i

export const webhookUrlSchema = z
  .string()
  .url('URL tidak valid')
  .max(500, 'URL terlalu panjang')
  .refine((url) => {
    try {
      const parsed = new URL(url)
      // Must be HTTPS
      if (parsed.protocol !== 'https:') return false
      // Block private/reserved hostnames
      if (PRIVATE_HOSTNAME_RE.test(parsed.hostname)) return false
      // Block .local, .internal TLDs
      if (/\.(local|internal|localhost)$/i.test(parsed.hostname)) return false
      return true
    } catch {
      return false
    }
  }, { message: 'Webhook URL harus HTTPS dan tidak boleh mengarah ke alamat lokal/private.' })
