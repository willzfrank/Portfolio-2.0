/**
 * One-off: upserts a single static project (by slug) into Supabase without
 * touching anything else. Usage: npx tsx scripts/add-project.ts <slug>
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

const slug = process.argv[2]
const i = projects.findIndex((p) => p.slug === slug)
if (i === -1) {
  console.error(`No static project with slug "${slug}"`)
  process.exit(1)
}
const p = projects[i]

async function main() {
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
  console.log(`Upserted "${p.title}" at position ${i}.`)
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
