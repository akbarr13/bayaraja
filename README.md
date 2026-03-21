<div align="center">

# Bayaraja

**Self-hosted QRIS payment link platform for Indonesian merchants.**
Create payment links with pre-filled amounts — customers just scan and pay.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/license-MIT-orange)](#license)

</div>

---

## What is Bayaraja?

Bayaraja is an open-source platform for creating **QRIS-based payment links** that can be integrated into online stores, POS systems, or any application.

**The problem it solves:** Static QRIS codes require customers to type the amount manually — leading to incorrect payments. Bayaraja converts static QRIS into **dynamic QRIS** with the amount already embedded, so customers just scan and pay the exact amount.

```
You create a payment link → Send URL to customer → Customer scans QR → Pays the exact amount
```

---

## Features

| Feature | Description |
|---------|-------------|
| 🔗 **Payment Links** | Generate unique links per transaction, share via WhatsApp/email |
| 📱 **Dynamic QRIS** | Amount auto-embedded in QR — no manual input needed |
| 📸 **Payment Proof** | Customers upload transfer screenshots, merchant confirms |
| 📊 **Dashboard** | Transaction stats, revenue overview, and real-time payment status |
| 🔑 **REST API** | Integrate with external systems using API keys |
| ⚡ **Status Polling** | Clients can poll payment status automatically after upload |
| 🛡️ **Rate Limiting** | Built-in protection on every public endpoint |
| 🔐 **Auth** | Secure login via Supabase Auth (email + password) |

---

## Tech Stack

- **Framework** — [Next.js 16](https://nextjs.org) App Router, React Server Components, Suspense Streaming
- **Backend** — [Supabase](https://supabase.com) (PostgreSQL, Auth, Storage)
- **Styling** — [Tailwind CSS v4](https://tailwindcss.com)
- **Validation** — [Zod v4](https://zod.dev)
- **QR Code** — [`qrcode`](https://github.com/soldair/node-qrcode) (generate) + [`jsqr`](https://github.com/cozmo/jsQR) (scan/parse)
- **Icons** — [Lucide React](https://lucide.dev)
- **Language** — TypeScript 5

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)

### 1. Clone the repo

```bash
git clone https://github.com/akbarr13/bayaraja.git
cd bayaraja
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Open the **SQL Editor** and run the full contents of [`supabase/schema.sql`](supabase/schema.sql)
3. Enable **Storage** and create a private bucket named `payment-proofs`

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Important:** `SUPABASE_SERVICE_ROLE_KEY` is used server-side only. Never expose it to the client.

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), register an account, add your QRIS, and start creating payment links.

---

## How It Works

```
┌─────────────┐   POST /api/links    ┌──────────────────┐
│   Merchant  │ ──────────────────► │   Bayaraja API   │
│ (Dashboard) │ ◄──────────────────  │                  │
└─────────────┘   { payment_url }   └────────┬─────────┘
                                             │
                        Send URL to customer │
                                             ▼
┌─────────────┐   GET /pay/{slug}    ┌──────────────────┐
│  Customer   │ ──────────────────► │   Payment Page   │
│  (Browser)  │                      │                  │
│             │  Scan QR & Upload    │  Dynamic QRIS +  │
└─────────────┘   Payment Proof      │   Upload Form    │
                                     └──────────────────┘
```

1. Merchant creates a payment link via dashboard or API
2. Bayaraja generates a dynamic QRIS with the amount embedded
3. Merchant sends the URL to the customer (WhatsApp, email, etc.)
4. Customer opens the URL → scans QR → pays → uploads proof
5. Merchant confirms in the dashboard → transaction complete

---

## API Reference

Base URL: `https://your-domain.com`

All API endpoints require:

```
Authorization: Bearer YOUR_API_KEY
```

Generate API keys in **Dashboard → Settings → API Keys**.

---

### `POST /api/qris/create-amount`

Generate a dynamic QRIS with a specific amount.

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

Create a new payment link.

```bash
curl -X POST https://your-domain.com/api/links \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "qris_account_id": "your-qris-uuid",
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

Check the payment status of a payment link.

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

| Code | Meaning |
|------|---------|
| `200` | Success |
| `400` | Invalid request — check body format or parameters |
| `401` | Missing, invalid, or disabled API key |
| `404` | Resource not found |
| `429` | Rate limit reached — wait and try again |
| `500` | Server error |

All error responses follow the format: `{ "error": "error message" }`

---

## Project Structure

```
bayaraja/
├── app/
│   ├── (auth)/          # Login & register pages
│   ├── (dashboard)/     # Protected merchant dashboard
│   │   ├── dashboard/   # Stats & recent transactions
│   │   ├── links/       # Manage payment links
│   │   ├── qris/        # Manage QRIS accounts
│   │   ├── settings/    # Profile, password, API keys
│   │   └── docs/        # Interactive API documentation
│   ├── api/             # API routes
│   ├── pay/[slug]/      # Public payment page
│   └── page.tsx         # Landing page
├── components/
│   ├── ui/              # Base UI components (Modal, Toast, etc.)
│   ├── dashboard/       # Dashboard-specific components
│   ├── pay/             # Payment page components
│   └── layout/          # Sidebar, header, navigation
├── lib/
│   ├── qris.ts          # EMV-CO QRIS conversion (static → dynamic)
│   ├── validations.ts   # Zod schemas
│   ├── types.ts         # TypeScript interfaces
│   └── supabase/        # Supabase clients (server & browser)
└── supabase/
    └── schema.sql       # Full database schema
```

---

## Default Limits

| Item | Limit |
|------|-------|
| QRIS accounts per user | 10 |
| Payment links per user | 100 |
| API keys per user | 5 |
| Upload file size | 5 MB |
| Upload file formats | JPEG, PNG, WebP |

---

## Deployment

### Vercel (Easiest)

1. Fork this repo
2. Import to [Vercel](https://vercel.com/new)
3. Add environment variables
4. Deploy — auto-deploys on every push to `main`

### cPanel / VPS

Bayaraja is configured with `output: standalone`.

```bash
npm run build
# Upload .next/standalone/ + public/ to your server
# Run: node .next/standalone/server.js
```

For cPanel, use Phusion Passenger pointed at a `app.js` entry file that requires `server.js`.

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Commit: `git commit -m 'feat: add your feature'`
4. Push: `git push origin feat/your-feature`
5. Open a Pull Request

---

## License

[MIT](LICENSE) — free to use, modify, and distribute.

---

<div align="center">
  <sub>Built for Indonesian merchants 🇮🇩</sub>
</div>
