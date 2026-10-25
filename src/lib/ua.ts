/** Small user-agent parser (enough for analytics; no dependency). */
export interface UA {
  device: 'mobile' | 'tablet' | 'desktop'
  browser: string
  os: string
  bot: boolean
}

export const parseUA = (ua: string): UA => {
  const bot = /bot|crawl|spider|slurp|preview|facebookexternalhit|lighthouse|headless|monitor|uptime/i.test(ua)
  const device = /ipad|tablet|playbook|silk/i.test(ua) || (/android/i.test(ua) && !/mobile/i.test(ua))
    ? 'tablet'
    : /mobi|iphone|ipod|android/i.test(ua)
    ? 'mobile'
    : 'desktop'

  let browser = 'Other'
  if (/edg(e|a|ios)?\//i.test(ua)) browser = 'Edge'
  else if (/opr\/|opera/i.test(ua)) browser = 'Opera'
  else if (/samsungbrowser/i.test(ua)) browser = 'Samsung Internet'
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox'
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome'
  else if (/safari/i.test(ua)) browser = 'Safari'

  let os = 'Other'
  if (/windows/i.test(ua)) os = 'Windows'
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS'
  else if (/android/i.test(ua)) os = 'Android'
  else if (/mac os|macintosh/i.test(ua)) os = 'macOS'
  else if (/cros/i.test(ua)) os = 'ChromeOS'
  else if (/linux/i.test(ua)) os = 'Linux'

  return { device, browser, os, bot }
}

export const hostOf = (url: string | null | undefined): string | null => {
  if (!url) return null
  try {
    return new URL(url).hostname.replace(/^www\./, '') || null
  } catch {
    return null
  }
}
