import {
  projects as staticProjects,
  Project,
  Contributor,
  ProjectImage,
  ProjectLink,
} from '@/data/projects'
import { getServerClient, isSupabaseConfigured } from './supabaseAdmin'

export interface ProjectRow {
  id: string
  position: number
  title: string
  slug: string
  type: string
  technologies: string[]
  timeline: string
  description: string
  long_description: string
  live_url: string
  github_url: string | null
  image: string
  category: Project['category']
  contributors: Contributor[]
  contributions: string[]
  images: ProjectImage[]
  links?: ProjectLink[] | null
  published: boolean
}

export const rowToProject = (row: ProjectRow, index: number): Project => ({
  id: String(index + 1).padStart(2, '0'),
  title: row.title,
  slug: row.slug,
  type: row.type,
  technologies: row.technologies,
  timeline: row.timeline,
  description: row.description,
  longDescription: row.long_description,
  liveUrl: row.live_url,
  githubUrl: row.github_url || undefined,
  image: row.image,
  category: row.category,
  contributors: row.contributors,
  contributions: row.contributions,
  images: row.images,
  // Until the `links` column exists (supabase/project-links.sql) use the built-in ones.
  links: row.links?.length ? row.links : staticProjects.find((p) => p.slug === row.slug)?.links ?? [],
})

/**
 * Projects for the public site. Reads from Supabase; falls back to the
 * static list when Supabase is unconfigured or has no projects yet.
 */
export const getProjects = async (): Promise<Project[]> =>
  // Next can't serialize `undefined` (e.g. a missing githubUrl) in props.
  JSON.parse(JSON.stringify(await loadProjects()))

const loadProjects = async (): Promise<Project[]> => {
  if (!isSupabaseConfigured()) return staticProjects
  const { data, error } = await getServerClient()
    .from('projects')
    .select('*')
    .eq('published', true)
    .order('position', { ascending: true })
    .order('created_at', { ascending: true })
  // Only fall back on errors: an intentionally empty table means "no projects".
  if (error || !data) return staticProjects
  return (data as ProjectRow[]).map(rowToProject)
}

export const getSiteContent = async (
  key: string
): Promise<Record<string, unknown> | null> => {
  if (!isSupabaseConfigured()) return null
  const { data } = await getServerClient()
    .from('site_content')
    .select('value')
    .eq('key', key)
    .maybeSingle()
  return (data?.value as Record<string, unknown>) ?? null
}
