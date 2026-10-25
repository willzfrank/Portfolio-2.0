import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabaseAdmin'

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
  const { name, email, message, website } = req.body ?? {}
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
  const { error } = await getServerClient()
    .from('messages')
    .insert({ name: name.trim(), email: email.trim(), message: message.trim() })
  if (error) return res.status(500).json({ error: 'Could not send message' })
  return res.status(201).json({ ok: true })
}
