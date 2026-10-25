import { withAdmin } from '@/lib/adminAuth'
import { getServerClient } from '@/lib/supabaseAdmin'
import { pickProjectFields } from '@/lib/projectInput'
import { revalidateSite } from '@/lib/revalidate'

export default withAdmin(async (req, res) => {
  const db = getServerClient()

  if (req.method === 'GET') {
    const { data, error } = await db
      .from('projects')
      .select('*')
      .order('position', { ascending: true })
      .order('created_at', { ascending: true })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const parsed = pickProjectFields(req.body, true)
    if ('error' in parsed) return res.status(400).json(parsed)
    let { data, error } = await db.from('projects').insert(parsed.fields).select().single()
    if (error && /links/.test(error.message) && 'links' in parsed.fields) {
      const { links: _links, ...rest } = parsed.fields
      ;({ data, error } = await db.from('projects').insert(rest).select().single())
    }
    if (error) return res.status(400).json({ error: error.message })
    await revalidateSite(res, [data.slug])
    return res.status(201).json(data)
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Method not allowed' })
})
