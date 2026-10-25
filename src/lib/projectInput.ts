// Would collide with real routes under /project.
const RESERVED_SLUGS = ['index']

const CATEGORIES = ['web-design', 'ai', 'hr', 'ecommerce', 'tech']

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : undefined)
const strArr = (v: unknown) =>
  Array.isArray(v)
    ? v.filter((x) => typeof x === 'string' && x.trim()).map((x) => x.trim())
    : undefined

/** Whitelists and validates project fields from an admin request body. */
export const pickProjectFields = (
  body: unknown,
  requireAll: boolean
): { fields: Record<string, unknown> } | { error: string } => {
  const b = (body ?? {}) as Record<string, unknown>
  const fields: Record<string, unknown> = {}

  const textKeys: [string, string][] = [
    ['title', 'title'],
    ['slug', 'slug'],
    ['type', 'type'],
    ['timeline', 'timeline'],
    ['description', 'description'],
    ['long_description', 'long_description'],
    ['live_url', 'live_url'],
    ['github_url', 'github_url'],
    ['image', 'image'],
  ]
  for (const [src, dst] of textKeys) {
    const v = str(b[src])
    if (v !== undefined) fields[dst] = dst === 'github_url' && !v ? null : v
  }
  const technologies = strArr(b.technologies)
  if (technologies) fields.technologies = technologies
  const contributions = strArr(b.contributions)
  if (contributions) fields.contributions = contributions
  if (Array.isArray(b.contributors)) fields.contributors = b.contributors
  if (Array.isArray(b.images)) fields.images = b.images
  if (typeof b.published === 'boolean') fields.published = b.published
  if (typeof b.position === 'number') fields.position = b.position
  if (b.category !== undefined) {
    if (!CATEGORIES.includes(b.category as string))
      return { error: 'Invalid category' }
    fields.category = b.category
  }

  if (typeof fields.slug === 'string') {
    fields.slug = fields.slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
  if (typeof fields.slug === 'string' && RESERVED_SLUGS.includes(fields.slug))
    return { error: `"${fields.slug}" is a reserved URL, pick another slug` }
  if (requireAll && (!fields.title || !fields.slug))
    return { error: 'Title and slug are required' }
  return { fields }
}
