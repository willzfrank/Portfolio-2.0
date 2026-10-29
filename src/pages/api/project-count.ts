import type { NextApiRequest, NextApiResponse } from 'next'
import { getProjects } from '@/lib/projectsRepo'

/** Number of published projects, for the count beside "Projects" in the nav. */
export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const count = (await getProjects().catch(() => [])).length
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
  res.status(200).json({ count })
}
