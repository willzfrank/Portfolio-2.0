import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Project } from '@/data/projects'
import { gsap } from '@/lib/gsap'
import { useReveal, scrollWords, fadeUp, drawRule, riseChars } from '@/lib/useReveal'
import PageShell from '@/components/page/PageShell'
import PageHero from '@/components/page/PageHero'
import { Section, SectionLabel, LinkOut } from '@/components/page/pageStyles'
import { MetaGrid, Cover, Story, Credits, Gallery, NextProject } from './caseStyles'

export interface NextRef {
  title: string
  slug: string
}

interface CaseStudyProps {
  project: Project
  next: NextRef | null
  index: number
  total: number
}

const CaseStudy = ({ project, next, index, total }: CaseStudyProps) => {
  const paragraphs = project.longDescription
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
  const [lead, ...rest] = paragraphs

  const ref = useReveal<HTMLDivElement>(
    ({ q, splits, reduce }) => {
      if (reduce) return

      // Media frames wipe open and settle as they enter the viewport.
      const frames = [...q('.cover-frame'), ...q('.gallery .frame')] as HTMLElement[]
      frames.forEach((f) => {
        gsap.from(f, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 1.5,
          ease: 'expo.inOut',
          scrollTrigger: { trigger: f, start: 'top 88%' },
        })
        const inner = f.querySelector('.inner, img')
        if (inner) {
          gsap.fromTo(
            inner,
            { scale: 1.2 },
            {
              scale: 1,
              ease: 'none',
              scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          )
        }
      })

      q('.label').forEach((l) => drawRule(l.querySelector('.rule'), l, 'top 88%'))

      const leadEl = q('.lead')[0]
      if (leadEl) scrollWords(leadEl, splits)
      const cols = q('.cols p')
      if (cols.length) fadeUp(cols, q('.cols')[0], 'top 85%')
      const credits = q('.credits li')
      if (credits.length) fadeUp(credits, q('.credits')[0], 'top 88%')

      const nextTitle = q('.next-title')[0]
      if (nextTitle) riseChars(nextTitle, splits, { trigger: nextTitle, start: 'top 92%' })
    },
    [project.slug]
  )

  return (
    <PageShell
      title={project.title}
      description={project.description}
      image={project.image}
      footer="full"
    >
      <div ref={ref}>
        <PageHero
          label="Case study"
          meta={`N°${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`}
          back={{ href: '/project', text: '← All projects' }}
          long
          lines={[{ text: project.title }]}
        >
          {project.description}
        </PageHero>

        <MetaGrid data-hero-in>
          <div>
            <dt>Timeline</dt>
            <dd>{project.timeline}</dd>
          </div>
          <div>
            <dt>Type</dt>
            <dd>{project.type}</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>{project.technologies.join(' · ')}</dd>
          </div>
          <div>
            <dt>Links</dt>
            <dd>
              <div className="links">
                {project.liveUrl && (
                  <LinkOut href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    Live site <span>↗</span>
                  </LinkOut>
                )}
                {project.githubUrl && (
                  <LinkOut href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    Source code <span>↗</span>
                  </LinkOut>
                )}
              </div>
            </dd>
          </div>
        </MetaGrid>

        {project.image && (
          <Cover className="cover-frame">
            <div className="inner">
              <Image
                src={project.image}
                alt={`${project.title} preview`}
                fill
                priority
                sizes="(max-width: 1400px) 95vw, 1368px"
              />
            </div>
          </Cover>
        )}

        <Section>
          <SectionLabel className="label">
            <span>(02) — Overview</span>
            <span>{project.type}</span>
            <span className="rule" />
          </SectionLabel>
          <Story>
            {lead && <p className="lead">{lead}</p>}
            {rest.length > 0 && (
              <div className="cols">
                {rest.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
          </Story>
        </Section>

        {(project.contributions.length > 0 || project.contributors.length > 0) && (
          <Section>
            <SectionLabel className="label">
              <span>(03) — Credits</span>
              <span />
              <span className="rule" />
            </SectionLabel>
            <Credits className="credits">
              {project.contributions.length > 0 && (
                <div>
                  <h3>My contribution</h3>
                  <ul>
                    {project.contributions.map((c, i) => (
                      <li key={i}>
                        <span>{c}</span>
                        <small>{String(i + 1).padStart(2, '0')}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {project.contributors.length > 0 && (
                <div>
                  <h3>Contributors</h3>
                  <ul>
                    {project.contributors.map((c, i) => (
                      <li key={i}>
                        {c.link ? (
                          <a href={c.link} target="_blank" rel="noopener noreferrer nofollow">
                            {c.name}
                          </a>
                        ) : (
                          <span>{c.name}</span>
                        )}
                        <small>{c.role}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Credits>
          </Section>
        )}

        {project.images.length > 0 && (
          <Section>
            <SectionLabel className="label">
              <span>(04) — Gallery</span>
              <span>{String(project.images.length).padStart(2, '0')} images</span>
              <span className="rule" />
            </SectionLabel>
            <Gallery className="gallery">
              {project.images.map((img, i) => (
                <figure key={i} className={img.height > img.width ? 'portrait' : ''}>
                  <div className="frame">
                    <Image
                      src={img.src}
                      alt={img.alt || project.title}
                      width={img.width}
                      height={img.height}
                      sizes="(max-width: 700px) 95vw, 1368px"
                    />
                  </div>
                </figure>
              ))}
            </Gallery>
          </Section>
        )}

        {next && (
          <NextProject>
            <SectionLabel className="label">
              <span>Next project</span>
              <span />
              <span className="rule" />
            </SectionLabel>
            <Link href={`/project/${next.slug}`} className="big" data-cursor>
              <div className="row">
                <span className="t next-title">{next.title}</span>
                <span className="arrow">↗</span>
              </div>
            </Link>
          </NextProject>
        )}
      </div>
    </PageShell>
  )
}

export default CaseStudy
