import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const title = searchParams.get('title') || 'Tagihan'
  const amount = parseInt(searchParams.get('amount') || '0', 10)
  const merchant = searchParams.get('merchant') || ''

  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          padding: '60px',
        }}
      >
        {/* Header — Bayaraja branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: '#F97316',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
            }}
          >
            ⚡
          </div>
          <span style={{ fontSize: '26px', fontWeight: 700, color: '#0F172A' }}>
            Bayaraja
          </span>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
          {merchant ? (
            <div style={{ fontSize: '22px', color: '#64748B' }}>
              Pembayaran ke {merchant}
            </div>
          ) : null}

          <div
            style={{
              fontSize: title.length > 40 ? '40px' : '52px',
              fontWeight: 800,
              color: '#0F172A',
              lineHeight: 1.15,
              maxWidth: '900px',
            }}
          >
            {title}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
            <span style={{ fontSize: '46px', fontWeight: 800, color: '#F97316' }}>
              {formattedAmount}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '18px', color: '#94A3B8' }}>
            Scan QR untuk membayar via QRIS
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FFF7ED',
              border: '1px solid #FED7AA',
              borderRadius: '24px',
              padding: '8px 20px',
            }}
          >
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#EA580C' }}>
              GoPay · OVO · Dana · ShopeePay
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
