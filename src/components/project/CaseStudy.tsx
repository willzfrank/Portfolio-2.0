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
import { MetaGrid, Actions, Highlights, HireStrip, Process, Screens, Cover, Story, Credits, Gallery, NextProject } from './caseStyles'

const EMAIL = 'willzudoh4@gmail.com'

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
  const hasStore = (re: RegExp) => (project.links ?? []).some((l) => re.test(l.url))
  const isApp = screens.length >= 2 && hasStore(/apple\.com|play\.google\.com/)
  // The cover already shows the main image, so don't repeat it in the gallery.
  const wide = project.images.filter(
    (i) => i.height / i.width < 1.6 && (isApp || i.src !== project.image)
  )

  const actions = [
    ...(project.links ?? []),
    ...(project.liveUrl ? [{ label: 'Live site', url: project.liveUrl }] : []),
    ...(project.githubUrl ? [{ label: 'Source code', url: project.githubUrl }] : []),
  ]
  const platforms = project.platforms ?? [
    project.liveUrl && 'Web',
    hasStore(/apple\.com/) && 'iOS',
    hasStore(/play\.google\.com/) && 'Android',
  ].filter(Boolean) as string[]

  const coverImg = project.images.find((i) => i.src === project.image)
  const caption = (i: number) => screens[i].caption || screens[i].alt || project.title

  // Sections are numbered in the order they appear, skipping any a project doesn't have.
  const showCredits = project.story
    ? project.contributors.length > 0
    : project.contributions.length > 0 || project.contributors.length > 0
  let n = 1
  const num = {
    overview: ++n,
    screens: screens.length > 0 ? ++n : 0,
    story: project.story ? ++n : 0,
    credits: showCredits ? ++n : 0,
    gallery: wide.length > 0 ? ++n : 0,
  }
  const label = (k: number) => `(${String(k).padStart(2, '0')})`

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

      // The cover is the first thing people see (and what load speed is measured on), so it is
      // never hidden: it just settles in. Frames further down wipe open as they scroll into view.
      q('.cover-frame .inner').forEach((el) => {
        gsap.from(el, { scale: 1.06, duration: 1.6, ease: 'expo.out' })
      })
      const frames = q('.gallery .frame') as HTMLElement[]
      frames.forEach((f) => {
        gsap.from(f, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 1.5,
          ease: 'expo.inOut',
          scrollTrigger: { trigger: f, start: 'top 88%' },
        })
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
      const process = q('.process .row')
      if (process.length) fadeUp(process, q('.process')[0], 'top 85%')
      const credits = q('.credits li')
      if (credits.length) fadeUp(credits, q('.credits')[0], 'top 88%')

      const nextTitle = q('.next-title')[0]
      if (nextTitle) riseChars(nextTitle, splits, { trigger: nextTitle, start: 'top 92%' })
    },
    [project.slug]
  )

  return (
    <PageShell
      title={`${project.title}: ${project.type}`}
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

        {project.highlights && (
          <Highlights data-hero-in aria-label="Project summary">
            <div>
              <h2>My role</h2>
              <p>{project.highlights.role}</p>
            </div>
            <div>
              <h2>Stack</h2>
              <p>{project.highlights.stack}</p>
            </div>
            <div>
              <h2>Timeline</h2>
              <p>{project.timeline}</p>
            </div>
            {platforms.length > 0 && (
              <div>
                <h2>Platforms</h2>
                <p>{platforms.join(' · ')}</p>
              </div>
            )}
            <div className="outcomes">
              <h2>Outcomes</h2>
              <ul>
                {project.highlights.outcomes.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </div>
          </Highlights>
        )}

        {!project.highlights && (
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
        )}

        {actions.length > 0 && (
          <Actions data-hero-in>
            {actions.map((a) => (
              <a key={a.url} href={a.url} target="_blank" rel="noopener noreferrer" data-cursor="Open">
                {a.label} <span>↗</span>
              </a>
            ))}
          </Actions>
        )}

        {actions.length === 0 && project.access && (
          <Actions data-hero-in>
            <Link href="/contact" data-cursor="Talk">
              Request a walkthrough <span>→</span>
            </Link>
            <span style={{ alignSelf: 'center', opacity: 0.7 }}>{project.access}</span>
          </Actions>
        )}

        {isApp && (
          <Stage className="stage">
            <div
              className="wash"
              style={
                project.accent
                  ? { background: `radial-gradient(circle at 50% 45%, ${project.accent}, #140805 75%)` }
                  : { backgroundImage: `url(${screens[0].src})` }
              }
            />
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
          <Cover
            className="cover-frame"
            style={{ aspectRatio: coverImg ? `${coverImg.width} / ${coverImg.height}` : '16 / 10' }}
          >
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
            <span>{label(num.overview)} — Overview</span>
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

        {isApp && (
          <Pinned className="pin">
            <div className="copy">
              <span className="count">
                {label(num.screens)} — Screens · <b className="cur">01</b> / {String(screens.length).padStart(2, '0')}
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
              <span>{label(num.screens)} — Screens</span>
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

        {project.story && (
          <Section>
            <SectionLabel className="label">
              <span>{label(num.story)} — How I built it</span>
              <span />
              <span className="rule" />
            </SectionLabel>
            <Process className="process">
              <div className="row">
                <h3>The challenge</h3>
                <p>{project.story.challenge}</p>
              </div>
              <div className="row">
                <h3>What I did</h3>
                <p>{project.story.approach}</p>
              </div>
              <div className="row">
                <h3>The result</h3>
                <p>{project.story.result}</p>
              </div>
              {project.contributions.length > 0 && (
                <div className="row">
                  <h3>My part</h3>
                  <ul>
                    {project.contributions.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Process>
          </Section>
        )}

        {showCredits && (
          <Section>
            <SectionLabel className="label">
              <span>{label(num.credits)} — Credits</span>
              <span />
              <span className="rule" />
            </SectionLabel>
            <Credits className="credits">
              {!project.story && project.contributions.length > 0 && (
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

        {wide.length > 0 && (
          <Section>
            <SectionLabel className="label">
              <span>{label(num.gallery)} — Gallery</span>
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

        <HireStrip>
          <SectionLabel className="label">
            <span>Work with me</span>
            <span />
            <span className="rule" />
          </SectionLabel>
          <div className="box">
            <div>
              <h2>Hiring? Let&apos;s talk.</h2>
              <p>I build fast, polished products like this one. Reach me the quickest way, no form needed.</p>
              <Link href="/contact" className="form-link" data-cursor="Talk">
                Prefer a form? Send a message →
              </Link>
            </div>
            <ul className="quick">
              <li>
                <a href={`mailto:${EMAIL}`} data-cursor="Email">
                  <small>Email</small>
                  <span>{EMAIL}</span>
                  <i>↗</i>
                </a>
              </li>
              <li>
                <a href="/api/resume" download target="_blank" rel="noopener noreferrer" data-cursor="Open">
                  <small>Resume</small>
                  <span>Download PDF</span>
                  <i>↗</i>
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/godswill-udoh/" target="_blank" rel="noopener noreferrer" data-cursor="Open">
                  <small>LinkedIn</small>
                  <span>godswill-udoh</span>
                  <i>↗</i>
                </a>
              </li>
              <li>
                <a href="https://github.com/willzfrank" target="_blank" rel="noopener noreferrer" data-cursor="Open">
                  <small>GitHub</small>
                  <span>willzfrank</span>
                  <i>↗</i>
                </a>
              </li>
            </ul>
          </div>
        </HireStrip>

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
