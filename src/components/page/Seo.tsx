import Head from 'next/head'

interface SeoProps {
  title: string
  description: string
  image?: string
}

/** Shared <head> for inner pages. */
const Seo = ({ title, description, image = '/profile.jpeg' }: SeoProps) => {
  const full = `Godswill Francis ™ | ${title}`
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
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={full} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  )
}

export default Seo
