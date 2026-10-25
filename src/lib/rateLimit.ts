import type { NextApiRequest } from 'next'

const hits = new Map<string, { count: number; reset: number }>()

/**
 * Best-effort in-memory limiter per IP. On serverless each instance keeps its
 * own counters, so this blunts bursts rather than guaranteeing a hard cap.
 */
export const rateLimited = (
  req: NextApiRequest,
  bucket: string,
  max: number,
  windowMs: number
): boolean => {
  const ip =
    (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0].trim() ||
    req.socket.remoteAddress ||
    'unknown'
  const key = `${bucket}:${ip}`
  const now = Date.now()
  const entry = hits.get(key)
  if (!entry || entry.reset < now) {
    hits.set(key, { count: 1, reset: now + windowMs })
    if (hits.size > 5000) {
      hits.forEach((v, k) => v.reset < now && hits.delete(k))
    }
    return false
  }
  entry.count++
  return entry.count > max
}
