/** Public address of the site, used for canonical links, social previews and the sitemap. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://godswillfrancis.vercel.app').replace(/\/$/, '')

/** Social crawlers need absolute URLs; leaves ones that already are untouched. */
export const absoluteUrl = (path: string) => (/^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${encodeURI(decodeURI(path))}`)
