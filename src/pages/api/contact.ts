import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabaseAdmin'
import { rateLimited } from '@/lib/rateLimit'
import { notifyContactMessage } from '@/lib/notify'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  if (!isSupabaseConfigured()) {
    return res.status(503).json({ error: 'Messaging is unavailable' })
  }
  if (rateLimited(req, 'contact', 5, 60 * 60 * 1000)) {
    return res.status(429).json({ error: 'Too many messages, try again later' })
  }
  const { name, email, message, website, ref } = req.body ?? {}
  if (website) return res.status(200).json({ ok: true }) // honeypot
  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof message !== 'string' ||
    !name.trim() ||
    !/^\S+@\S+\.\S+$/.test(email) ||
    !message.trim() ||
    message.length > 5000
  ) {
    return res.status(400).json({ error: 'Please fill in all fields' })
  }
  const db = getServerClient()
  // Global backstop across serverless instances.
  const { count } = await db
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
  if ((count ?? 0) >= 30) {
    return res.status(429).json({ error: 'Too many messages, try again later' })
  }
  const tag = typeof ref === 'string' && ref ? ref.slice(0, 60) : null
  const row = { name: name.trim(), email: email.trim(), message: message.trim() }
  let { error } = await db.from('messages').insert({ ...row, ref: tag })
  // The `ref` column comes from supabase/message-ref.sql; still save the message if it's missing.
  if (error && /ref/.test(error.message)) ({ error } = await db.from('messages').insert(row))
  if (error) return res.status(500).json({ error: 'Could not send message' })
  await notifyContactMessage({
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    ref: tag,
  })
  return res.status(201).json({ ok: true })
}
