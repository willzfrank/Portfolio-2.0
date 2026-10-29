import React from 'react'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import { useReveal, scrollWords, fadeUp, drawRule } from '@/lib/useReveal'
import PageShell from '@/components/page/PageShell'
import PageHero from '@/components/page/PageHero'
import { Section, SectionLabel, LinkOut } from '@/components/page/pageStyles'
import { BioGrid, ExpList, SkillGrid } from '@/components/about/aboutPageStyles'

const EXPERIENCE = [
  { role: 'Senior Frontend Developer', company: 'Polar Frequency', when: 'Dec 2024 — Present' },
  { role: 'Senior Frontend Developer', company: 'Sterling Bank', when: 'Jun 2023 — Aug 2025' },
  { role: 'Senior Frontend Developer', company: 'Santoms', when: 'Dec 2022 — Present' },
  { role: 'React Developer', company: 'Ullweb Technologies', when: 'Sep 2022 — Present' },
  { role: 'Frontend Developer', company: 'Yetti Technologies', when: 'Dec 2021 — Aug 2022' },
  { role: 'Frontend Developer', company: 'Vsonet Group', when: 'Jan 2020 — Feb 2021' },
  { role: 'Frontend Developer Intern', company: 'Side Hustle', when: 'May 2020 — Jun 2020' },
]

const SKILLS = [
  'JavaScript', 'ReactJS', 'NextJS', 'TypeScript', 'Python', 'Material UI',
  'Tailwind CSS', 'Git', 'Bitbucket', 'Styled-Components', 'HTML5', 'SASS',
  'SCSS', 'CSS3', 'Docker', 'AWS', 'Azure DevOps', 'Circle CI',
  'Responsive Design', 'Performance Optimization', 'Agile Development',
  'REST', 'GraphQL', 'React Native', 'Flutter', 'Node.js', 'NestJS', 'Java',
  'Spring Boot', 'PostgreSQL', 'Redis', 'WebSockets', 'System Design',
]

const About = () => {
  const ref = useReveal<HTMLDivElement>(({ q, splits, reduce }) => {
    if (reduce) return

    const portrait = q('.portrait')[0]
    if (portrait) {
      gsap.from(portrait, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 1.6,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: portrait, start: 'top 88%' },
      })
      gsap.fromTo(
        q('.portrait .inner'),
        { scale: 1.25 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: portrait, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      )
    }

    const lead = q('.lead')[0]
    if (lead) scrollWords(lead, splits)
    const second = q('.second')[0]
    if (second) fadeUp(second, second, 'top 92%')

    q('.label').forEach((l) => drawRule(l.querySelector('.rule'), l, 'top 88%'))
    // Animate each row's cells, not the row: the row has a CSS opacity transition for the hover dimming.
    q('.exp .row').forEach((row) => fadeUp(Array.from(row.children), row, 'top 92%'))
    fadeUp(q('.skills span'), q('.skills')[0], 'top 88%')
    const resume = q('.resume')[0]
    if (resume) fadeUp(resume, resume, 'top 95%')
  })

  return (
    <PageShell
      title="About"
      description="Godswill Francis is a software developer in Lagos, Nigeria, building web, mobile, backend and cloud products."
      footer="full"
    >
      <div ref={ref}>
        <PageHero
          label="(01) — About"
          meta="Lagos, Nigeria"
          lines={[{ text: 'About' }, { text: 'me', out: true }]}
        />

        <Section style={{ paddingTop: 0 }}>
          <BioGrid>
            <div className="portrait">
              <div className="inner">
                <Image
                  src="/profile.jpeg"
                  alt="Portrait of Godswill Francis"
                  fill
                  priority
                  sizes="(max-width: 800px) 90vw, 36vw"
                />
              </div>
            </div>
            <div>
              <p className="lead">
                Unleash tech’s beauty with me, Godswill Francis — a software dev
                who transforms user experiences into stunning works of art. With
                5 years of experience merging tech and beauty, I’ve honed my
                skills in UI development with a keen eye for detail, and I build
                the back end too: APIs, queues, databases and money-safe
                transaction logic. Skilled in React, TypeScript, Next.js,
                Node.js, Java, Python, Docker, AWS and Azure DevOps, I’ve worked with companies across different industries,
                delivering scalable solutions while prioritizing user
                experience. Let’s create something amazing together!
              </p>
              <p className="second">
                I have had the privilege of working with organizations such as
                Vsonet Groups, Ullweb Technologies and Yetti Technologies.
                Currently I have unlimited availability for freelance projects,
                so if you believe I can help with your innovative endeavor,
                reach out at{' '}
                <a href="mailto:willzudoh4@gmail.com">willzudoh4@gmail.com</a>.
              </p>
            </div>
          </BioGrid>
        </Section>

        <Section>
          <SectionLabel className="label">
            <span>(02) — Experience</span>
            <span>{String(EXPERIENCE.length).padStart(2, '0')} roles</span>
            <span className="rule" />
          </SectionLabel>
          <ExpList className="exp">
            {EXPERIENCE.map((e, i) => (
              <div className="row" key={`${e.company}-${e.role}`}>
                <span className="n">{String(i + 1).padStart(2, '0')}</span>
                <span className="role">{e.role}</span>
                <span className="co">{e.company}</span>
                <span className="when">{e.when}</span>
              </div>
            ))}
          </ExpList>
          <div style={{ marginTop: 'clamp(2rem, 4vw, 3rem)' }} className="resume">
            <LinkOut href="/api/resume" target="_blank" download>
              Download resume <span>↓</span>
            </LinkOut>
          </div>
        </Section>

        <Section>
          <SectionLabel className="label">
            <span>(03) — Skills</span>
            <span>{String(SKILLS.length).padStart(2, '0')} tools</span>
            <span className="rule" />
          </SectionLabel>
          <SkillGrid className="skills">
            {SKILLS.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </SkillGrid>
        </Section>
      </div>
    </PageShell>
  )
}

export default About
