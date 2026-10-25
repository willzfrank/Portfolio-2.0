import type { NextApiResponse } from 'next'

/** Rebuilds the cached public pages right after an admin change. */
export const revalidateSite = async (
  res: NextApiResponse,
  slugs: (string | null | undefined)[] = []
) => {
  const paths = new Set(['/', '/project'])
  for (const s of slugs) if (s) paths.add(`/project/${s}`)
  await Promise.allSettled(Array.from(paths).map((p) => res.revalidate(p)))
}
