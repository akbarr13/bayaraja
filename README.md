<div align="center">

# Bayaraja

**Platform payment link QRIS untuk Indonesia.**
Buat link pembayaran dengan nominal otomatis — pelanggan tinggal scan, langsung terbayar.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/license-MIT-orange)](#lisensi)

</div>

---

## Apa itu Bayaraja?

Bayaraja adalah platform open-source untuk membuat **payment link berbasis QRIS** yang bisa diintegrasikan ke toko online, sistem POS, atau aplikasi apapun.

**Masalah yang diselesaikan:** QRIS statis mengharuskan pelanggan mengetik nominal sendiri — rawan salah bayar. Bayaraja mengkonversi QRIS statis menjadi **QRIS dinamis** dengan nominal yang sudah tertanam, sehingga pelanggan cukup scan dan bayar.

```
Kamu buat payment link → Kirim URL ke pelanggan → Pelanggan scan QR → Bayar dengan nominal pas
```

---

## Fitur Utama

| Fitur | Keterangan |
|-------|------------|
| 🔗 **Payment Link** | Buat link unik per transaksi, kirim via WhatsApp/email |
| 📱 **QRIS Dinamis** | Nominal otomatis tertanam — pelanggan tidak perlu ketik manual |
| 📸 **Bukti Pembayaran** | Pelanggan upload screenshot, merchant konfirmasi |
| 📊 **Dashboard** | Statistik transaksi, pendapatan, dan status pembayaran real-time |
| 🔑 **REST API** | Integrasikan ke sistem eksternal dengan API key |
| ⚡ **Polling Status** | Client bisa polling status otomatis setelah upload bukti |
| 🛡️ **Rate Limiting** | Perlindungan bawaan di setiap endpoint publik |
| 🔐 **Auth** | Login aman via Supabase Auth (email + password) |

---

## Tech Stack

- **Framework** — [Next.js 16](https://nextjs.org) App Router, React Server Components, Suspense Streaming
- **Backend** — [Supabase](https://supabase.com) (PostgreSQL, Auth, Storage)
- **Styling** — [Tailwind CSS v4](https://tailwindcss.com)
- **Validasi** — [Zod v4](https://zod.dev)
- **QR Code** — [`qrcode`](https://github.com/soldair/node-qrcode) (generate) + [`jsqr`](https://github.com/cozmo/jsQR) (scan/parse)
- **Icons** — [Lucide React](https://lucide.dev)
- **Language** — TypeScript 5

---

## Memulai

### Prasyarat

- Node.js 18+
- Akun [Supabase](https://supabase.com) (gratis)

### 1. Clone repo

```bash
git clone https://github.com/username/bayaraja.git
cd bayaraja
npm install
```

### 2. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Buka **SQL Editor** dan jalankan seluruh isi [`supabase/schema.sql`](supabase/schema.sql)
3. Aktifkan **Storage**, buat bucket bernama `payment-proofs` (private)

### 3. Konfigurasi environment

```bash
cp .env.local.example .env.local
```

Isi `.env.local` dengan kredensial dari dashboard Supabase kamu:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Penting:** `SUPABASE_SERVICE_ROLE_KEY` hanya digunakan server-side. Jangan pernah expose ke client.

### 4. Jalankan dev server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000), daftar akun, tambah QRIS, dan mulai buat payment link.

---

## Cara Kerja

```
┌─────────────┐   POST /api/links    ┌──────────────────┐
│   Merchant  │ ──────────────────► │   Bayaraja API   │
│ (Dashboard) │ ◄──────────────────  │                  │
└─────────────┘   { payment_url }   └────────┬─────────┘
                                             │
                       Kirim URL ke pelanggan│
                                             ▼
┌─────────────┐   GET /pay/{slug}    ┌──────────────────┐
│  Pelanggan  │ ──────────────────► │  Halaman Bayar   │
│  (Browser)  │                      │                  │
│             │  Scan QR & Upload    │  QRIS Dinamis +  │
└─────────────┘     Bukti            │   Upload Form    │
                                     └──────────────────┘
```

1. Merchant buat payment link via dashboard atau API
2. Bayaraja generate QRIS dinamis (nominal sudah tertanam)
3. Merchant kirim URL ke pelanggan (WhatsApp, email, dll)
4. Pelanggan buka URL → scan QR → bayar → upload bukti
5. Merchant konfirmasi di dashboard → transaksi selesai

---

## API Reference

Base URL: `https://your-domain.com`

Semua endpoint memerlukan header:

```
Authorization: Bearer YOUR_API_KEY
```

API key dibuat di **Dashboard → Pengaturan → API Keys**.

---

### `POST /api/qris/create-amount`

Generate QRIS dinamis dengan nominal tertentu.

```bash
curl -X POST https://your-domain.com/api/qris/create-amount \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"amount": 75000}'
```

<details>
<summary>Response</summary>

```json
{
  "success": true,
  "data": {
    "qris_dynamic": "000201...",
    "qr_image_url": "data:image/png;base64,...",
    "amount": 75000,
    "merchant_name": "Toko Kopi Nusantara"
  }
}
```
</details>

---

### `POST /api/links`

Buat payment link baru.

```bash
curl -X POST https://your-domain.com/api/links \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "qris_account_id": "uuid-qris-kamu",
    "title": "Order #42",
    "amount": 75000,
    "is_single_use": true
  }'
```

<details>
<summary>Response</summary>

```json
{
  "data": {
    "id": "uuid",
    "slug": "abc123xyz456abcd",
    "title": "Order #42",
    "amount": 75000,
    "is_active": true,
    "payment_url": "https://your-domain.com/pay/abc123xyz456abcd"
  }
}
```
</details>

---

### `GET /api/pay/{slug}/status`

Cek status pembayaran suatu payment link.

```bash
curl https://your-domain.com/api/pay/abc123xyz/status \
  -H "Authorization: Bearer YOUR_API_KEY"
```

<details>
<summary>Response</summary>

```json
{
  "slug": "abc123xyz",
  "title": "Order #42",
  "amount": 75000,
  "paid": true,
  "summary": { "confirmed": 1, "pending": 0, "total": 1 },
  "latest_transaction": {
    "id": "uuid",
    "status": "confirmed",
    "amount": 75000,
    "payer_name": "Budi Santoso",
    "created_at": "2026-03-21T10:00:00Z"
  }
}
```
</details>

---

### Error Codes

| Kode | Artinya |
|------|---------|
| `200` | Berhasil |
| `400` | Request tidak valid — cek format body atau parameter |
| `401` | API key tidak ada, salah, atau sudah dinonaktifkan |
| `404` | Data tidak ditemukan |
| `429` | Rate limit tercapai — tunggu sebentar lalu coba lagi |
| `500` | Server error |

Semua error response berformat: `{ "error": "pesan error" }`

---

## Struktur Proyek

```
bayaraja/
├── app/
│   ├── (auth)/          # Halaman login & register
│   ├── (dashboard)/     # Dashboard merchant (protected)
│   │   ├── dashboard/   # Statistik & transaksi terbaru
│   │   ├── links/       # Kelola payment links
│   │   ├── qris/        # Kelola akun QRIS
│   │   ├── settings/    # Profil, password, API keys
│   │   └── docs/        # Dokumentasi API interaktif
│   ├── api/             # API routes
│   ├── pay/[slug]/      # Halaman pembayaran publik
│   └── page.tsx         # Landing page
├── components/
│   ├── ui/              # Komponen UI dasar (Modal, Toast, dll)
│   ├── dashboard/       # Komponen khusus dashboard
│   ├── pay/             # Komponen halaman pembayaran
│   └── layout/          # Sidebar, header, navigasi
├── lib/
│   ├── qris.ts          # Algoritma konversi QRIS EMV-CO (static → dynamic)
│   ├── validations.ts   # Zod schemas
│   ├── types.ts         # TypeScript interfaces
│   └── supabase/        # Supabase client (server & browser)
└── supabase/
    └── schema.sql       # Skema database lengkap
```

---

## Batasan Default

| Item | Batas |
|------|-------|
| Akun QRIS per user | 10 |
| Payment links per user | 100 |
| API keys per user | 5 |
| Ukuran file upload | 5 MB |
| Format file upload | JPEG, PNG, WebP |

---

## Deploy

### Vercel (Paling Mudah)

1. Fork repo ini
2. Import ke [Vercel](https://vercel.com/new)
3. Isi environment variables
4. Deploy otomatis setiap push ke `main`

### cPanel / VPS

Bayaraja dikonfigurasi dengan `output: standalone`.

```bash
npm run build
# Upload .next/standalone/ + public/ ke server
# Jalankan: node .next/standalone/server.js
```

Untuk cPanel, gunakan Phusion Passenger dengan `app.js` yang me-require `server.js`.

---

## Kontribusi

Pull request terbuka untuk siapa saja. Untuk perubahan besar, buka issue dulu.

1. Fork repo
2. Buat branch: `git checkout -b feat/nama-fitur`
3. Commit: `git commit -m 'feat: tambah fitur X'`
4. Push: `git push origin feat/nama-fitur`
5. Buka Pull Request

---

## Lisensi

[MIT](LICENSE) — bebas digunakan, dimodifikasi, dan didistribusikan.

---

<div align="center">
  <sub>Dibuat untuk merchant Indonesia 🇮🇩</sub>
</div>
