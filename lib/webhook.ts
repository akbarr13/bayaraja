import { createServerSupabase } from '@/lib/supabase/server'
import crypto from 'crypto'

export type WebhookEvent =
  | 'transaction.created'
  | 'transaction.confirmed'
  | 'transaction.rejected'

export interface WebhookPayload {
  event: WebhookEvent
  created_at: string
  data: Record<string, unknown>
}

/**
 * Fire-and-forget: deliver webhook to all active endpoints registered by userId.
 * Signs payload with HMAC-SHA256 using the webhook's secret.
 * Errors are swallowed intentionally — never block the main request.
 */
export async function fireWebhooks(
  userId: string,
  event: WebhookEvent,
  data: Record<string, unknown>
): Promise<void> {
  try {
    const sb = createServerSupabase()
    const { data: webhooks } = await sb
      .from('webhooks')
      .select('id, url, secret')
      .eq('user_id', userId)
      .eq('is_active', true)

    if (!webhooks || webhooks.length === 0) return

    const payload: WebhookPayload = {
      event,
      created_at: new Date().toISOString(),
      data,
    }
    const body = JSON.stringify(payload)

    await Promise.allSettled(
      webhooks.map(async (wh) => {
        const sig = crypto
          .createHmac('sha256', wh.secret)
          .update(body)
          .digest('hex')

        const headers = {
          'Content-Type': 'application/json',
          'X-Bayaraja-Event': event,
          'X-Bayaraja-Signature': `sha256=${sig}`,
        }

        let success = false
        for (let attempt = 0; attempt <= 1; attempt++) {
          if (attempt === 1) {
            // Wait 5s before retry
            await new Promise((resolve) => setTimeout(resolve, 5000))
          }

          const controller = new AbortController()
          const timeout = setTimeout(() => controller.abort(), 5000)

          try {
            const res = await fetch(wh.url, {
              method: 'POST',
              headers,
              body,
              signal: controller.signal,
            })
            if (res.ok) {
              success = true
              break
            }
          } catch {
            // Timeout or network error — retry if first attempt
          } finally {
            clearTimeout(timeout)
          }
        }

        if (success) {
          await sb
            .from('webhooks')
            .update({ last_triggered_at: new Date().toISOString() })
            .eq('id', wh.id)
        }
      })
    )
  } catch {
    // Never throw — webhook delivery must not break the caller
  }
}
