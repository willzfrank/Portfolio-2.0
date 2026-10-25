import type { NextApiRequest, NextApiResponse } from 'next'
import { getSiteContent } from '@/lib/projectsRepo'

const FALLBACK = '/Godswill_Francis_Resume.pdf'

/** One stable resume URL: sends visitors to whichever PDF is set in the admin. */
export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  let url = FALLBACK
  try {
    const value = await getSiteContent('resume')
    if (typeof value?.url === 'string' && /^https:\/\//.test(value.url)) {
      url = value.url
    }
  } catch {}
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
  res.redirect(302, url)
}
