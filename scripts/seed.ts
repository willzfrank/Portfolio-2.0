/**
 * One-off: copies the static projects (src/data/projects.ts) and the About
 * text into Supabase. Safe to re-run; projects upsert by slug.
 * Usage: npx tsx scripts/seed.ts
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

const ABOUT = `With 5 years of software development experience, I am now working with Polar Frequency, having previously been part of the amazing team at Sterling Bank Plc. I am a master of crafting efficient and creative solutions. Passionate about using tech for good, I am constantly seeking innovative problem-solving methods. Expert in React, Next.js, TypeScript, Node.js, and modern web technologies, I deliver high-quality software that impresses clients. I have a talent for simplifying complex ideas and strive to continuously improve.`

async function main() {
  const rows = projects.map((p, i) => ({
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
  }))
  const { error } = await db.from('projects').upsert(rows, { onConflict: 'slug' })
  if (error) throw new Error(`projects: ${error.message}`)

  const { error: e2 } = await db
    .from('site_content')
    .upsert({ key: 'about', value: { text: ABOUT } })
  if (e2) throw new Error(`site_content: ${e2.message}`)

  console.log(`Seeded ${rows.length} projects and the About text.`)
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
