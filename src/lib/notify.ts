/**
 * Emails a short note about a visit from outside Nigeria, via Resend's HTTP API.
 * Needs RESEND_API_KEY; without it this does nothing. NOTIFY_EMAIL picks the
 * recipient and NOTIFY_FROM the sender (Resend's sandbox sender only delivers
 * to the email the Resend account was created with).
 */
const HOME_COUNTRY = 'NG'
const MAX_PER_HOUR = 40

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
  utm_source?: string | null
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

/** Sends one email through Resend; silent no-op without a key or past the hourly cap. */
const sendMail = async (subject: string, html: string, replyTo?: string) => {
  const key = process.env.RESEND_API_KEY
  if (!key) return

  // Cheap guard so a bot swarm can't flood the inbox.
  const now = Date.now()
  if (now - windowStart > 60 * 60 * 1000) {
    windowStart = now
    sent = 0
  }
  if (sent >= MAX_PER_HOUR) return
  sent++

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.NOTIFY_FROM || 'Portfolio <onboarding@resend.dev>',
        to: process.env.NOTIFY_EMAIL || 'willzudoh4@gmail.com',
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      signal: AbortSignal.timeout(4000),
    })
  } catch {
    // Never let a mail failure affect the request that triggered it.
  }
}

const placeOf = (v: Pick<VisitInfo, 'city' | 'region' | 'country'>) =>
  [v.city, v.region, v.country ? countryName(v.country.toUpperCase()) : null]
    .filter(Boolean)
    .join(', ')

export const notifyForeignVisit = async (v: VisitInfo) => {
  const country = v.country?.toUpperCase()
  if (!country || country === HOME_COUNTRY) return

  const place = placeOf(v)
  const rows: [string, string | null | undefined][] = [
    ['Where', place],
    ['Device', [v.device, v.browser, v.os].filter(Boolean).join(' · ')],
    ['Tracked link', v.utm_source],
    ['Came from', v.referrer_host || 'Direct'],
    ['Landed on', v.landing_path],
    ['Language', v.language],
  ]
  const html = rows
    .filter(([, val]) => val)
    .map(([k, val]) => `<p><b>${k}:</b> ${esc(String(val))}</p>`)
    .join('')

  await sendMail(`New visit from ${place || country}`, html)
}

/** A contact-form message; replying to the email goes straight to the sender. */
export const notifyContactMessage = async (m: {
  name: string
  email: string
  message: string
  ref?: string | null
}) => {
  const html =
    `<p><b>From:</b> ${esc(m.name)} &lt;${esc(m.email)}&gt;</p>` +
    (m.ref ? `<p><b>Tracked link:</b> ${esc(m.ref)}</p>` : '') +
    `<p style="white-space:pre-wrap">${esc(m.message)}</p>`
  await sendMail(`New message from ${m.name}`, html, m.email)
}

/** Someone clicked a resume/PDF link on the site. */
export const notifyResumeDownload = async (v: {
  country: string | null
  region: string | null
  city: string | null
  device: string | null
  browser: string | null
  os: string | null
  file?: string | null
  path?: string | null
  ref?: string | null
}) => {
  const place = placeOf(v)
  const rows: [string, string | null | undefined][] = [
    ['Where', place],
    ['Device', [v.device, v.browser, v.os].filter(Boolean).join(' · ')],
    ['Tracked link', v.ref],
    ['File', v.file],
    ['Clicked on', v.path],
  ]
  const html = rows
    .filter(([, val]) => val)
    .map(([k, val]) => `<p><b>${k}:</b> ${esc(String(val))}</p>`)
    .join('')

  await sendMail(`Resume downloaded${place ? ` from ${place}` : ''}`, html)
}
