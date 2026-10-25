/**
 * One-off: upserts the Café One, Whipcare and Bucks Invest projects at the top of the
 * list and shifts every other project down, without touching their content.
 * Usage: npx tsx scripts/add-new-work.ts
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { projects } from '../src/data/projects'

for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
}
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  { auth: { persistSession: false } }
)

const NEW = ['cafeone', 'whipcare', 'bucksinvest']

async function main() {
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i]
    if (NEW.includes(p.slug)) {
      const { error } = await db.from('projects').upsert(
        {
          position: i,
          title: p.title,
          slug: p.slug,
          type: p.type,
          technologies: p.technologies,
          timeline: p.timeline,
          description: p.description,
          long_description: p.longDescription,
          live_url: p.liveUrl,
          github_url: p.githubUrl ?? null,
          image: p.image,
          category: p.category,
          contributors: p.contributors,
          contributions: p.contributions,
          images: p.images,
          published: true,
        },
        { onConflict: 'slug' }
      )
      if (error) throw new Error(error.message)
    } else {
      const { error } = await db.from('projects').update({ position: i }).eq('slug', p.slug)
      if (error) throw new Error(error.message)
    }
    console.log(`${i}  ${p.slug}`)
  }
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
