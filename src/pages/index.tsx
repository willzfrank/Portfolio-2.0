import { SITE_URL, absoluteUrl } from '@/lib/site'
import Head from 'next/head'
import React from 'react'
import { Navbar } from '@/components/navbar'
import Header from '@/components/header/Header'
import Manifesto from '@/components/home/Manifesto'
import WorkIndex from '@/components/home/WorkIndex'
import Ticker from '@/components/home/Ticker'
import Contact from '@/components/home/Contact'
import ScrollProgress from '@/components/home/ScrollProgress'
import Preloader, { hasPreloaderPlayed } from '@/components/preloader/Preloader'
import StructuredData from '@/components/StructuredData'
import { GetStaticProps } from 'next'
import { Project } from '@/data/projects'
import { getProjects, getSiteContent } from '@/lib/projectsRepo'

export default function Home({
  projects,
  aboutText,
}: {
  projects: Project[]
  aboutText: string | null
}) {
  const [isLoading, setIsLoading] = React.useState(() => !hasPreloaderPlayed())
  // True from the moment the loader's panels start lifting.
  const [revealing, setRevealing] = React.useState(false)

  return (
    <>
      {isLoading && (
        <Preloader
          onComplete={() => setIsLoading(false)}
          onLeaving={() => setRevealing(true)}
        />
      )}
      {(
        <>
          <Head>
            <title>Godswill Francis &trade; | Home</title>
            <meta
              name="description"
              content="Personal portfolio of Godswill Francis - Software Developer working across web, mobile, backend and cloud"
            />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="preload" href="/profile-hero.jpeg" as="image" />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/favicon_io (2)/favicon-32x32.png"
            />

            <meta property="og:title" content="Godswill Francis ™ | Home" />
            <meta
              property="og:description"
              content="Personal portfolio of Godswill Francis - Software Developer working across web, mobile, backend and cloud"
            />
            <meta property="og:image" content={absoluteUrl('/profile.jpeg')} />
            <meta property="og:url" content={SITE_URL} />
            <link rel="canonical" href={SITE_URL} />
            <meta property="og:type" content="website" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="Godswill Francis ™ | Home" />
            <meta
              name="twitter:description"
              content="Personal portfolio of Godswill Francis - Software Developer working across web, mobile, backend and cloud"
            />
            <meta name="twitter:image" content={absoluteUrl('/profile.jpeg')} />
          </Head>

          <StructuredData
            type="Person"
            data={{
              name: 'Godswill Francis',
              jobTitle: 'Software Developer',
              description:
                'A software developer with 5 years of experience across web, mobile, backend and cloud',
              url: SITE_URL,
              sameAs: [
                'https://github.com/willzfrank',
                'https://twitter.com/willzfrank001',
                'https://www.linkedin.com/in/godswill-udoh/',
              ],
              knowsAbout: [
                'React',
                'TypeScript',
                'Next.js',
                'JavaScript',
                'CSS',
                'HTML',
                'Python',
                'Docker',
                'AWS',
                'Azure DevOps',
                'Circle CI',
                'Bitbucket',
              ],
              worksFor: {
                '@type': 'Organization',
                name: 'Freelance',
              },
            }}
          />

          <ScrollProgress />
          <Navbar />
          <div className="w95">
            <div className="overflow_hidden">
              <Header
                ready={!isLoading || revealing}
                projects={projects.map(({ title, slug, type }) => ({ title, slug, type }))}
              />
              <Manifesto text={aboutText} />
              <WorkIndex projects={projects} />
            </div>
          </div>
          <Ticker />
          <Contact />
        </>
      )}
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const [projects, about] = await Promise.all([
    getProjects(),
    getSiteContent('about'),
  ])
  return {
    props: {
      projects,
      aboutText: typeof about?.text === 'string' ? about.text : null,
    },
    revalidate: 60,
  }
}
