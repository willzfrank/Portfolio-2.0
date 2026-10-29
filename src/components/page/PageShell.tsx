import React from 'react'
import { Navbar } from '@/components/navbar'
import ScrollProgress from '@/components/home/ScrollProgress'
import Contact from '@/components/home/Contact'
import Seo from './Seo'

interface PageShellProps {
  title: string
  description: string
  image?: string
  noindex?: boolean
  /** 'full' ends with the big "Let's build" panel; 'minimal' is just the footer. */
  footer?: 'full' | 'minimal'
  children: React.ReactNode
}

/** Common frame for inner pages: head, nav, progress line, content, footer. */
const PageShell = ({
  title,
  description,
  image,
  noindex,
  footer = 'full',
  children,
}: PageShellProps) => (
  <>
    <Seo title={title} description={description} image={image} noindex={noindex} />
    <ScrollProgress />
    <Navbar />
    <main className="w95">
      <div className="overflow_hidden">{children}</div>
    </main>
    <Contact minimal={footer === 'minimal'} />
  </>
)

export default PageShell
