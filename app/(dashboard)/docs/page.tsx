'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { copyToClipboard } from '@/lib/clipboard'

const BASE_URL = 'https://bayaraja.com'

function Code({ children }: { children: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    copyToClipboard(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="relative group">
      <pre className="overflow-x-auto rounded-xl bg-[#0F172A] text-slate-300 text-xs p-4 leading-relaxed">
        <code>{children}</code>
      </pre>
      <button
        onClick={copy}
        className="absolute right-3 top-3 rounded-md bg-slate-700 px-2 py-1 text-xs text-slate-300 opacity-0 group-hover:opacity-100 hover:bg-slate-600 transition-all"
      >
        {copied ? 'Disalin!' : 'Salin'}
      </button>
    </div>
  )
}

function Badge({ method }: { method: 'GET' | 'POST' | 'PATCH' | 'DELETE' }) {
  const colors = {
    GET: 'bg-blue-50 text-blue-700 border-blue-200',
    POST: 'bg-green-50 text-green-700 border-green-200',
    PATCH: 'bg-amber-50 text-amber-700 border-amber-200',
    DELETE: 'bg-red-50 text-red-700 border-red-200',
  }
  return (
    <span className={cn('inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-mono font-semibold', colors[method])}>
      {method}
    </span>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-8">
      <h2 className="text-lg font-heading font-bold text-text mb-4 pb-2 border-b border-gray-100">{title}</h2>
      <div className="space-y-6">{children}</div>
    </section>
  )
}

function Endpoint({
  method,
  path,
  description,
  auth,
  body,
  response,
  note,
}: {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  path: string
  description: string
  auth: 'api-key' | 'session'
  body?: string
  response: string
  note?: string
}) {
  return (
    <div className="rounded-xl border border-gray-100 overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 px-5 py-3.5 bg-gray-50 border-b border-gray-100">
        <Badge method={method} />
        <code className="text-sm font-mono text-text">{path}</code>
        {auth === 'api-key' && (
          <span className="ml-auto text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">API Key</span>
        )}
        {auth === 'session' && (
          <span className="ml-auto text-xs text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-2 py-0.5">Session</span>
        )}
      </div>
      <div className="px-5 py-4 space-y-4">
        <p className="text-sm text-gray-600">{description}</p>
        {note && (
          <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-xs text-blue-700">{note}</div>
        )}
        {body && (
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Request Body</p>
            <Code>{body}</Code>
          </div>
        )}
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Response</p>
          <Code>{response}</Code>
        </div>
      </div>
    </div>
  )
}

const sections = [
  { id: 'autentikasi', label: 'Autentikasi' },
  { id: 'qris', label: 'Generate QRIS' },
  { id: 'links', label: 'Payment Links' },
  { id: 'transactions', label: 'Transaksi' },
  { id: 'webhooks', label: 'Webhooks' },
  { id: 'status', label: 'Cek Status Bayar' },
  { id: 'errors', label: 'Error Codes' },
]

export default function DocsPage() {
  return (
    <div className="flex gap-10 items-start">
      {/* Sidebar nav */}
      <aside className="hidden xl:block w-44 flex-shrink-0 sticky top-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Isi</p>
        <nav className="space-y-1">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="block text-sm text-gray-500 hover:text-text py-1 transition-colors"
            >
              {s.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-12">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text">API Reference</h1>
          <p className="mt-1 text-sm text-gray-500">
            Integrasikan Bayaraja ke sistem, toko online, atau aplikasi Anda.
            Base URL: <code className="text-xs bg-gray-100 rounded px-1.5 py-0.5">{BASE_URL}</code>
          </p>
        </div>

        {/* Autentikasi */}
        <Section id="autentikasi" title="Autentikasi">
          <p className="text-sm text-gray-600">
            Semua endpoint API menggunakan <strong>API Key</strong> yang dikirim lewat header <code className="text-xs bg-gray-100 rounded px-1 py-0.5">Authorization</code>.
            Buat API key di halaman <a href="/settings" className="text-primary underline">Pengaturan → API Keys</a>.
          </p>
          <Code>{`Authorization: Bearer YOUR_API_KEY`}</Code>
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <strong>Penting:</strong> API key hanya ditampilkan sekali saat dibuat. Simpan di tempat yang aman dan jangan share ke siapapun.
          </div>
        </Section>

        {/* Generate QRIS */}
        <Section id="qris" title="Generate QRIS Dinamis">
          <p className="text-sm text-gray-600">
            Generate QR code QRIS dengan nominal tertentu. Gunakan ini kalau kamu mau tampilkan QR di sistem sendiri (POS, website, dll).
          </p>
          <Endpoint
            method="POST"
            path="/api/qris/create-amount"
            auth="api-key"
            description="Generate QR code QRIS dinamis dengan nominal yang kamu tentukan."
            body={`{
  "amount": 75000,
  "qris_account_id": "uuid-opsional"  // opsional, default pakai QRIS utama
}`}
            response={`{
  "success": true,
  "data": {
    "qris_dynamic": "000201...",      // string QRIS dinamis
    "qr_image_url": "data:image/png;base64,...",
    "amount": 75000,
    "merchant_name": "Toko Kopi Nusantara",
    "expires_in": null
  }
}`}
            note="Jika qris_account_id tidak diisi, otomatis pakai QRIS yang dijadikan default. Rate limit: 60 request/menit."
          />

          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Contoh (curl)</p>
            <Code>{`curl -X POST ${BASE_URL}/api/qris/create-amount \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"amount": 75000}'`}</Code>
          </div>
        </Section>

        {/* Links */}
        <Section id="links" title="Buat Payment Link">
          <p className="text-sm text-gray-600">
            Buat payment link yang tersimpan dan punya URL yang bisa dikirim ke pelanggan. Berbeda dengan generate QRIS — link ini bisa dilacak transaksinya di dashboard.
          </p>
          <Endpoint
            method="POST"
            path="/api/links"
            auth="api-key"
            description="Buat payment link baru. Response berisi URL siap kirim ke pelanggan."
            body={`{
  "qris_account_id": "uuid-qris-kamu",  // wajib
  "title": "Order #42",                  // wajib
  "amount": 75000,                       // wajib, dalam Rupiah
  "description": "Pesanan 2 kopi",       // opsional
  "is_single_use": true,                 // opsional, default false
  "expires_at": "2026-04-01T00:00:00Z"  // opsional
}`}
            response={`{
  "data": {
    "id": "uuid",
    "slug": "abc123xyz456abcd",
    "title": "Order #42",
    "amount": 75000,
    "is_active": true,
    "is_single_use": true,
    "expires_at": "2026-04-01T00:00:00Z",
    "created_at": "2026-03-21T10:00:00Z",
    "payment_url": "https://bayaraja.com/pay/abc123xyz456abcd"
  }
}`}
            note="Gunakan payment_url dari response untuk dikirim ke pelanggan via WhatsApp, email, dll."
          />

          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Contoh (curl)</p>
            <Code>{`curl -X POST ${BASE_URL}/api/links \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "qris_account_id": "uuid-qris-kamu",
    "title": "Order #42",
    "amount": 75000,
    "is_single_use": true
  }'`}</Code>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Contoh alur lengkap (JavaScript)</p>
            <Code>{`// 1. Buat payment link
const res = await fetch('${BASE_URL}/api/links', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    qris_account_id: 'uuid-qris-kamu',
    title: \`Order #\${orderId}\`,
    amount: totalHarga,
    is_single_use: true,
  }),
})
const { data } = await res.json()

// 2. Kirim URL ke pelanggan
await sendWhatsApp(nomorPelanggan, \`Silakan bayar di: \${data.payment_url}\`)

// 3. Polling sampai dibayar
const poll = setInterval(async () => {
  const status = await fetch(\`${BASE_URL}/api/pay/\${data.slug}/status\`, {
    headers: { Authorization: 'Bearer YOUR_API_KEY' },
  }).then(r => r.json())

  if (status.paid) {
    clearInterval(poll)
    console.log('Pembayaran diterima!')
    // update order di sistem kamu
  }
}, 10000)`}</Code>
          </div>
        </Section>

        {/* Transactions */}
        <Section id="transactions" title="Transaksi">
          <p className="text-sm text-gray-600">
            Ambil daftar transaksi dengan filter dan pagination. Cocok untuk sinkronisasi ke sistem order kamu.
          </p>

          <Endpoint
            method="GET"
            path="/api/transactions"
            auth="api-key"
            description="Daftar transaksi dengan pagination dan filter opsional."
            response={`{
  "data": [
    {
      "id": "uuid",
      "payment_link_id": "uuid",
      "amount": 75000,
      "payer_name": "Budi Santoso",
      "payer_email": null,
      "status": "confirmed",
      "created_at": "2026-03-21T10:00:00Z",
      "payment_link": { "title": "Order #42", "slug": "abc123" }
    }
  ],
  "total": 84,
  "page": 0,
  "limit": 20
}`}
            note="Query params: page (default 0), limit (default 20, max 100), status (pending|confirmed|rejected), link_id, from, to (ISO date)."
          />

          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Contoh dengan filter</p>
            <Code>{`curl "${BASE_URL}/api/transactions?status=pending&limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</Code>
          </div>

          <Endpoint
            method="GET"
            path="/api/transactions/export"
            auth="session"
            description="Download semua transaksi sebagai file CSV. Mendukung filter yang sama dengan endpoint list."
            response={`ID,Tanggal,Link,Slug,Pembayar,Email,Nominal,Status,Catatan
uuid,"21/3/2026 10.00.00","Order #42","abc123","Budi",,"75000","confirmed",`}
            note="Response adalah file CSV dengan BOM (UTF-8) — langsung bisa dibuka di Excel. Hanya tersedia via session (dashboard), bukan API key."
          />
        </Section>

        {/* Webhooks */}
        <Section id="webhooks" title="Webhooks">
          <p className="text-sm text-gray-600">
            Daftarkan URL yang akan di-POST setiap kali ada event transaksi. Kelola webhook di halaman{' '}
            <a href="/settings" className="text-primary underline">Pengaturan → Webhooks</a>.
          </p>

          <div className="rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 space-y-4">
              <p className="text-sm font-semibold text-text">Events yang tersedia</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  { event: 'transaction.created', desc: 'Pelanggan upload bukti bayar' },
                  { event: 'transaction.confirmed', desc: 'Kamu konfirmasi pembayaran' },
                  { event: 'transaction.rejected', desc: 'Kamu tolak pembayaran' },
                ].map((e) => (
                  <div key={e.event} className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2">
                    <code className="text-xs font-mono text-primary">{e.event}</code>
                    <p className="text-xs text-gray-500 mt-1">{e.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Format payload</p>
            <Code>{`// POST ke URL webhook kamu
{
  "event": "transaction.created",
  "created_at": "2026-03-21T10:00:00Z",
  "data": {
    "transaction_id": "uuid",
    "payment_link_id": "uuid",
    "amount": 75000,
    "payer_name": "Budi Santoso",
    "payer_email": null
  }
}`}</Code>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Verifikasi signature</p>
            <Code>{`// Setiap request webhook punya header:
// X-Bayaraja-Event: transaction.created
// X-Bayaraja-Signature: sha256=<hmac>

// Verifikasi dengan secret yang didapat saat buat webhook:
const crypto = require('crypto')

function verifyWebhook(body, signature, secret) {
  const expected = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  )
}

// Express.js contoh:
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['x-bayaraja-signature']
  if (!verifyWebhook(req.body, sig, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature')
  }
  const payload = JSON.parse(req.body)
  console.log('Event:', payload.event)
  res.sendStatus(200)
})`}</Code>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            <strong>Catatan:</strong> Webhook dikirim dengan timeout 5 detik. Jika URL tidak merespons, pengiriman dianggap gagal (tidak ada retry). Pastikan endpoint kamu cepat merespons (200 OK) sebelum memproses event.
          </div>
        </Section>

        {/* Status */}
        <Section id="status" title="Cek Status Pembayaran">
          <p className="text-sm text-gray-600">
            Cek apakah sebuah payment link sudah dibayar. Gunakan <code className="text-xs bg-gray-100 rounded px-1 py-0.5">slug</code> dari link yang kamu buat di dashboard.
          </p>
          <Endpoint
            method="GET"
            path="/api/pay/{slug}/status"
            auth="api-key"
            description="Return status pembayaran beserta ringkasan transaksi untuk payment link tersebut."
            response={`{
  "slug": "abc123xyz",
  "title": "Order #42",
  "amount": 75000,
  "is_active": true,
  "expires_at": null,
  "paid": true,                        // true jika ada transaksi confirmed
  "summary": {
    "confirmed": 1,
    "pending": 0,
    "total": 1
  },
  "latest_transaction": {
    "id": "uuid",
    "status": "confirmed",
    "amount": 75000,
    "payer_name": "Budi Santoso",
    "payer_email": null,
    "created_at": "2026-03-21T10:00:00Z"
  }
}`}
            note="Hanya bisa mengecek link milik akun kamu sendiri. Field paid: true artinya sudah ada konfirmasi dari kamu."
          />

          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Contoh (curl)</p>
            <Code>{`curl ${BASE_URL}/api/pay/abc123xyz/status \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</Code>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Contoh polling (JavaScript)</p>
            <Code>{`async function waitForPayment(slug, apiKey, intervalMs = 10000) {
  return new Promise((resolve) => {
    const timer = setInterval(async () => {
      const res = await fetch(\`${BASE_URL}/api/pay/\${slug}/status\`, {
        headers: { Authorization: \`Bearer \${apiKey}\` },
      })
      const data = await res.json()
      if (data.paid) {
        clearInterval(timer)
        resolve(data.latest_transaction)
      }
    }, intervalMs)
  })
}

// Penggunaan
const tx = await waitForPayment('abc123xyz', 'YOUR_API_KEY')
console.log('Dibayar oleh:', tx.payer_name)`}</Code>
          </div>
        </Section>

        {/* Errors */}
        <Section id="errors" title="Error Codes">
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-24">Kode</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Artinya</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { code: '200', desc: 'Berhasil.' },
                  { code: '400', desc: 'Request tidak valid — cek format body atau parameter.' },
                  { code: '401', desc: 'API key tidak ada, salah, atau sudah dinonaktifkan.' },
                  { code: '404', desc: 'Data tidak ditemukan — slug salah atau bukan milik akun kamu.' },
                  { code: '429', desc: 'Terlalu banyak request. Tunggu sebentar lalu coba lagi.' },
                  { code: '500', desc: 'Server error. Coba lagi atau hubungi support.' },
                ].map((e) => (
                  <tr key={e.code}>
                    <td className="px-4 py-3 font-mono text-sm text-gray-700">{e.code}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{e.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500">
            Semua response error punya format: <code className="text-xs bg-gray-100 rounded px-1 py-0.5">{`{ "error": "pesan error" }`}</code>
          </p>
        </Section>
      </div>
    </div>
  )
}
