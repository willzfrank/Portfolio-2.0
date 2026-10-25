/** One-off: restrict the `portfolio` bucket to small images. Safe to re-run. */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
}
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  { auth: { persistSession: false } }
)

db.storage
  .updateBucket('portfolio', {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'],
  })
  .then(({ error }) => {
    if (error) throw new Error(error.message)
    console.log('Bucket limited to 5 MB images.')
  })
  .catch((e) => {
    console.error(e.message)
    process.exit(1)
  })
