import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerClient, isSupabaseConfigured } from './supabaseAdmin'

type Handler = (req: NextApiRequest, res: NextApiResponse) => Promise<unknown>

const adminEmails = (): string[] =>
  (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

/** Wraps an API route so only a signed-in, allow-listed admin can call it. */
export const withAdmin =
  (handler: Handler): Handler =>
  async (req, res) => {
    if (!isSupabaseConfigured()) {
      return res.status(500).json({ error: 'Supabase is not configured' })
    }
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '')
    if (!token) return res.status(401).json({ error: 'Not signed in' })

    const { data, error } = await getServerClient().auth.getUser(token)
    const email = data.user?.email?.toLowerCase()
    if (error || !email || !adminEmails().includes(email)) {
      return res.status(403).json({ error: 'Not authorized' })
    }
    try {
      return await handler(req, res)
    } catch (e) {
      return res
        .status(500)
        .json({ error: e instanceof Error ? e.message : 'Server error' })
    }
  }
