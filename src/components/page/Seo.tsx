import Head from 'next/head'
import { useRouter } from 'next/router'
import { SITE_URL, absoluteUrl } from '@/lib/site'

interface SeoProps {
  title: string
  description: string
  image?: string
}

/** Shared <head> for inner pages. */
const Seo = ({ title, description, image = '/profile.jpeg' }: SeoProps) => {
  const full = `Godswill Francis ™ | ${title}`
  const { asPath } = useRouter()
  const url = `${SITE_URL}${asPath.split(/[?#]/)[0] === '/' ? '' : asPath.split(/[?#]/)[0]}`
  const img = absoluteUrl(image)
  return (
    <Head>
      <title>{full}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon_io (2)/favicon-32x32.png"
      />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={full} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
    </Head>
  )
}

export default Seo
