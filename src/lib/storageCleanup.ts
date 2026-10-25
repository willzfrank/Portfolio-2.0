import { getServerClient } from './supabaseAdmin'

const BUCKET = 'portfolio'
const MARKER = `/storage/v1/object/public/${BUCKET}/`

const pathFromUrl = (url: unknown): string | null => {
  if (typeof url !== 'string') return null
  const i = url.indexOf(MARKER)
  return i === -1 ? null : decodeURIComponent(url.slice(i + MARKER.length))
}

interface ImageRefs {
  image?: string | null
  images?: { src: string }[] | null
}

export const imageUrls = (p: ImageRefs): string[] => [
  ...(p.image ? [p.image] : []),
  ...(p.images ?? []).map((i) => i.src),
]

/** Deletes uploaded files (ignores static /public paths and external URLs). */
export const removeUploaded = async (urls: string[]) => {
  const paths = urls.map(pathFromUrl).filter((p): p is string => Boolean(p))
  if (paths.length) await getServerClient().storage.from(BUCKET).remove(paths)
}
