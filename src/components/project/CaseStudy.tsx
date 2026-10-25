import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Project } from '@/data/projects'
import { gsap } from '@/lib/gsap'
import { useReveal, scrollWords, fadeUp, drawRule, riseChars } from '@/lib/useReveal'
import PageShell from '@/components/page/PageShell'
import PageHero from '@/components/page/PageHero'
import { Section, SectionLabel, LinkOut } from '@/components/page/pageStyles'
import { Phone, Stage, Pinned, StripWrap } from './appStyles'
import { MetaGrid, Actions, Screens, Cover, Story, Credits, Gallery, NextProject } from './caseStyles'

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

  // Wide shots go in the gallery; tall phone screens get their own horizontal strip.
  const screens = project.images.filter((i) => i.height / i.width >= 1.6)
  const wide = project.images.filter((i) => i.height / i.width < 1.6)

  const actions = [
    ...(project.links ?? []),
    ...(project.liveUrl ? [{ label: 'Live site', url: project.liveUrl }] : []),
    ...(project.githubUrl ? [{ label: 'Source code', url: project.githubUrl }] : []),
  ]
  const hasStore = (re: RegExp) => (project.links ?? []).some((l) => re.test(l.url))
  const platforms = [
    project.liveUrl && 'Web',
    hasStore(/apple\.com/) && 'iOS',
    hasStore(/play\.google\.com/) && 'Android',
  ].filter(Boolean) as string[]

  const isApp = screens.length >= 2 && hasStore(/apple\.com|play\.google\.com/)
  const caption = (i: number) => screens[i].caption || screens[i].alt || project.title

  const stripRef = React.useRef<HTMLDivElement>(null)
  // Mouse drag-to-scroll for the screens strip (touch and trackpads already scroll it).
  const onStripDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = stripRef.current
    if (!el || e.pointerType !== 'mouse') return
    const startX = e.clientX
    const startLeft = el.scrollLeft
    el.classList.add('dragging')
    const move = (ev: PointerEvent) => {
      el.scrollLeft = startLeft - (ev.clientX - startX)
    }
    const up = () => {
      el.classList.remove('dragging')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const ref = useReveal<HTMLDivElement>(
    ({ q, splits, reduce }) => {
      if (reduce) {
        q('.pin').forEach((el) => ((el as HTMLElement).style.display = 'none'))
        q('.strip-wrap').forEach((el) => ((el as HTMLElement).style.display = 'block'))
        return
      }

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

      // App hero: the two phones drift apart as you scroll past.
      const stage = q('.stage')[0]
      if (stage) {
        gsap.to(q('.stage .front'), {
          yPercent: -6,
          rotation: -8,
          ease: 'none',
          scrollTrigger: { trigger: stage, start: 'top bottom', end: 'bottom top', scrub: true },
        })
        gsap.to(q('.stage .back'), {
          yPercent: 7,
          rotation: 11,
          ease: 'none',
          scrollTrigger: { trigger: stage, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      }

      // Pinned showcase: one phone stays put, its screen and caption change as you scroll.
      const pin = q('.pin')[0] as HTMLElement | undefined
      if (pin) {
        const mm = gsap.matchMedia()
        mm.add('(min-width: 801px)', () => {
          const shotsEl = q('.pin .shot') as HTMLElement[]
          const caps = q('.pin .cap') as HTMLElement[]
          const dots = q('.pin .dots i') as HTMLElement[]
          const cur = q('.pin .cur')[0] as HTMLElement | undefined
          const n = shotsEl.length
          gsap.set(shotsEl.slice(1), { clipPath: 'inset(100% 0 0 0)' })
          gsap.set(caps.slice(1), { opacity: 0, y: 40 })
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: pin,
              start: 'top top',
              end: () => `+=${(n - 1) * 85}%`,
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const i = Math.min(n - 1, Math.round(self.progress * (n - 1)))
                if (cur) cur.textContent = String(i + 1).padStart(2, '0')
                dots.forEach((d, k) => d.classList.toggle('on', k === i))
              },
            },
          })
          for (let i = 1; i < n; i++) {
            tl.to(shotsEl[i], { clipPath: 'inset(0% 0 0 0)', duration: 1 }, i - 1)
              .to(caps[i - 1], { opacity: 0, y: -40, duration: 0.45 }, i - 1)
              .fromTo(caps[i], { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.45 }, i - 0.45)
              .to(q('.pin .device')[0], { rotation: i % 2 ? 2.5 : -2.5, duration: 1 }, i - 1)
          }
        })
      }

      const shots = q('.screens figure')
      if (shots.length) {
        gsap.from(shots, {
          y: 90,
          opacity: 0,
          scale: 0.94,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.12,
          scrollTrigger: { trigger: q('.screens')[0], start: 'top 85%' },
        })
      }

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
            <dt>Focus</dt>
            <dd>{project.technologies.join(' · ')}</dd>
          </div>
          {platforms.length > 0 && (
            <div>
              <dt>Platforms</dt>
              <dd>{platforms.join(' · ')}</dd>
            </div>
          )}
        </MetaGrid>

        {actions.length > 0 && (
          <Actions data-hero-in>
            {actions.map((a) => (
              <a key={a.url} href={a.url} target="_blank" rel="noopener noreferrer" data-cursor="Open">
                {a.label} <span>↗</span>
              </a>
            ))}
          </Actions>
        )}

        {isApp && (
          <Stage className="stage">
            <div className="wash" style={{ backgroundImage: `url(${screens[0].src})` }} />
            <div className="grain" />
            <div className="phones">
              <Phone className="phone back">
                <div className="screen">
                  <Image src={screens[1].src} alt="" fill sizes="320px" />
                </div>
              </Phone>
              <Phone className="phone front">
                <div className="screen">
                  <Image src={screens[0].src} alt={project.title} fill sizes="320px" priority />
                </div>
              </Phone>
            </div>
            <span className="tag">{platforms.filter((p) => p !== 'Web').join(' · ') || 'Mobile'}</span>
          </Stage>
        )}

        {!isApp && project.image && (
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

        {isApp && (
          <Pinned className="pin">
            <div className="copy">
              <span className="count">
                (04) — Screens · <b className="cur">01</b> / {String(screens.length).padStart(2, '0')}
              </span>
              <div className="caps">
                {screens.map((_, i) => (
                  <h3 key={i} className="cap">
                    {caption(i)}
                  </h3>
                ))}
              </div>
              <div className="dots">
                {screens.map((_, i) => (
                  <i key={i} className={i === 0 ? 'on' : ''} />
                ))}
              </div>
            </div>
            <div className="device">
              <Phone>
                <div className="screen">
                  {screens.map((img, i) => (
                    <div key={i} className="shot">
                      <Image
                        src={img.src}
                        alt={img.alt || project.title}
                        fill
                        sizes="(max-width: 1400px) 40vw, 420px"
                      />
                    </div>
                  ))}
                </div>
              </Phone>
            </div>
          </Pinned>
        )}

        {screens.length > 0 && (
          <StripWrap className="strip-wrap" $app={isApp}>
          <Section>
            <SectionLabel className="label">
              <span>(04) — Screens</span>
              <span>{String(screens.length).padStart(2, '0')} screens · drag</span>
              <span className="rule" />
            </SectionLabel>
            <Screens
              ref={stripRef}
              className="screens"
              onPointerDown={onStripDown}
              data-cursor="Drag"
            >
              {screens.map((img, i) => (
                <figure key={i}>
                  <Image
                    src={img.src}
                    alt={img.alt || project.title}
                    width={img.width}
                    height={img.height}
                    sizes="(max-width: 700px) 60vw, 360px"
                  />
                </figure>
              ))}
            </Screens>
          </Section>
          </StripWrap>
        )}

        {wide.length > 0 && (
          <Section>
            <SectionLabel className="label">
              <span>(05) — Gallery</span>
              <span>{String(wide.length).padStart(2, '0')} images</span>
              <span className="rule" />
            </SectionLabel>
            <Gallery className="gallery">
              {wide.map((img, i) => (
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
            <Link href={`/project/${next.slug}`} className="big" data-cursor="Next">
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
