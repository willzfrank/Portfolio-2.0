import type { GetServerSideProps } from 'next'
import { getProjects } from '@/lib/projectsRepo'
import { SITE_URL } from '@/lib/site'

const STATIC_PAGES: [string, string][] = [
  ['/', '1.0'],
  ['/project', '0.9'],
  ['/about', '0.8'],
  ['/contact', '0.8'],
  ['/privacy', '0.3'],
]

/** Built per request from the published projects, so new ones appear without editing a file. */
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const projects = await getProjects().catch(() => [])
  const urls = [
    ...STATIC_PAGES,
    ...projects.map((p) => [`/project/${p.slug}`, '0.7'] as [string, string]),
  ]
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls
      .map(([path, priority]) => `  <url><loc>${SITE_URL}${path === '/' ? '' : path}</loc><priority>${priority}</priority></url>`)
      .join('\n') +
    '\n</urlset>\n'
  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  res.write(xml)
  res.end()
  return { props: {} }
}

export default function Sitemap() {
  return null
}
