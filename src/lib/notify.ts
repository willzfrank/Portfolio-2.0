/**
 * Emails a short note about a visit from outside Nigeria, via Resend's HTTP API.
 * Needs RESEND_API_KEY; without it this does nothing. NOTIFY_EMAIL picks the
 * recipient and NOTIFY_FROM the sender (Resend's sandbox sender only delivers
 * to the email the Resend account was created with).
 */
const HOME_COUNTRY = 'NG'
const MAX_PER_HOUR = 20

let windowStart = 0
let sent = 0

export interface VisitInfo {
  country: string | null
  region: string | null
  city: string | null
  device: string | null
  browser: string | null
  os: string | null
  referrer_host: string | null
  landing_path: string | null
  language?: string | null
}

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

const countryName = (code: string) => {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) ?? code
  } catch {
    return code
  }
}

export const notifyForeignVisit = async (v: VisitInfo) => {
  const key = process.env.RESEND_API_KEY
  const country = v.country?.toUpperCase()
  if (!key || !country || country === HOME_COUNTRY) return

  // Cheap guard so a bot swarm can't flood the inbox.
  const now = Date.now()
  if (now - windowStart > 60 * 60 * 1000) {
    windowStart = now
    sent = 0
  }
  if (sent >= MAX_PER_HOUR) return
  sent++

  const place = [v.city, v.region, countryName(country)].filter(Boolean).join(', ')
  const rows: [string, string | null | undefined][] = [
    ['Where', place],
    ['Device', [v.device, v.browser, v.os].filter(Boolean).join(' · ')],
    ['Came from', v.referrer_host || 'Direct'],
    ['Landed on', v.landing_path],
    ['Language', v.language],
  ]
  const html = rows
    .filter(([, val]) => val)
    .map(([k, val]) => `<p><b>${k}:</b> ${esc(String(val))}</p>`)
    .join('')

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.NOTIFY_FROM || 'Portfolio <onboarding@resend.dev>',
        to: process.env.NOTIFY_EMAIL || 'willzudoh4@gmail.com',
        subject: `New visit from ${place || country}`,
        html,
      }),
      signal: AbortSignal.timeout(4000),
    })
  } catch {
    // Never let a mail failure affect analytics.
  }
}
