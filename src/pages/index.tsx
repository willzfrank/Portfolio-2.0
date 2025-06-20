import Head from 'next/head'
import React from 'react'
import { Navbar } from '@/components/navbar'
import Header from '@/components/header/Header'
import AboutComponent from '@/components/about/About'
import Works from '@/components/works/Works'
import Footer from '@/components/footer/Footer'
import Marquee from '@/components/marquee/Marquee'
import Preloader from '@/components/preloader/Preloader'
import StructuredData from '@/components/StructuredData'

export default function Home() {
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 5000)
  }, [])

  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <>
          <Head>
            <title>Godswill Francis &trade; | Home</title>
            <meta
              name="description"
              content="Personal portfolio of Godswill Francis - Frontend Developer with expertise in React, TypeScript, Next.js, Python, Docker, AWS, and Azure DevOps"
            />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link
              rel="stylesheet"
              href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"
            ></link>
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/favicon_io (2)/favicon-32x32.png"
            />

            <meta property="og:title" content="Godswill Francis ™ | Home" />
            <meta
              property="og:description"
              content="Personal portfolio of Godswill Francis - Frontend Developer with expertise in React, TypeScript, Next.js, Python, Docker, AWS, and Azure DevOps"
            />
            <meta property="og:image" content="/path/to/image.jpg" />
            <meta property="og:url" content="https://yourwebsite.com" />
            <meta property="og:type" content="website" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="Godswill Francis ™ | Home" />
            <meta
              name="twitter:description"
              content="Personal portfolio of Godswill Francis - Frontend Developer with expertise in React, TypeScript, Next.js, Python, Docker, AWS, and Azure DevOps"
            />
            <meta name="twitter:image" content="/path/to/image.jpg" />
          </Head>

          <StructuredData
            type="Person"
            data={{
              name: 'Godswill Francis',
              jobTitle: 'Frontend Developer',
              description:
                'A passionate frontend developer with 5 years of experience in React, TypeScript, Next.js, Python, Docker, AWS, and Azure DevOps',
              url: 'https://yourwebsite.com',
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

          <Navbar />
          <div className="w95">
            <div className="overflow_hidden">
              <Header />
              <AboutComponent />
              <Works />
              <Marquee />
              <Footer />
            </div>
          </div>
        </>
      )}
    </>
  )
}
