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

// The home page only shows the top projects in the admin order; the rest live on /project.
const HOME_PROJECTS = 4

export default function Home({
  projects,
  totalProjects,
  aboutText,
}: {
  projects: Project[]
  totalProjects: number
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
            <title>Godswill Francis | Software Engineer: Web, Mobile & Backend, Lagos</title>
            <meta
              name="description"
              content="Personal portfolio of Godswill Francis - Software Engineer working across web, mobile, backend and cloud"
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

            <meta property="og:title" content="Godswill Francis | Software Engineer: Web, Mobile & Backend, Lagos" />
            <meta
              property="og:description"
              content="Personal portfolio of Godswill Francis - Software Engineer working across web, mobile, backend and cloud"
            />
            <meta property="og:image" content={absoluteUrl('/og.jpg')} />
            <meta property="og:url" content={SITE_URL} />
            <link rel="canonical" href={SITE_URL} />
            <meta property="og:type" content="website" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="Godswill Francis | Software Engineer: Web, Mobile & Backend, Lagos" />
            <meta
              name="twitter:description"
              content="Personal portfolio of Godswill Francis - Software Engineer working across web, mobile, backend and cloud"
            />
            <meta name="twitter:image" content={absoluteUrl('/og.jpg')} />
          </Head>

          <StructuredData type="WebSite" data={{ name: 'Godswill Francis', url: SITE_URL }} />
          <StructuredData
            type="Person"
            data={{
              name: 'Godswill Francis',
              jobTitle: 'Software Engineer',
              description:
                'A software engineer with 5 years of experience across web, mobile, backend and cloud',
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
                'Node.js',
                'Java',
                '.NET',
                'Go',
                'React Native',
                'Flutter',
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
              <WorkIndex projects={projects} total={totalProjects} />
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
      projects: projects.slice(0, HOME_PROJECTS),
      totalProjects: projects.length,
      aboutText: typeof about?.text === 'string' ? about.text : null,
    },
    revalidate: 60,
  }
}
