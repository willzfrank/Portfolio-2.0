import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useReveal, fadeUp, drawRule } from '@/lib/useReveal'
import PageShell from '@/components/page/PageShell'
import PageHero from '@/components/page/PageHero'
import { Section, SectionLabel } from '@/components/page/pageStyles'
import ContactForm from '@/components/ContactForm'
import { MINT, DIM, HAIR } from '@/components/home/homeStyles'

const EMAIL = 'willzudoh4@gmail.com'

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.2fr);
  gap: clamp(2.5rem, 7vw, 7rem);
  margin-top: clamp(1.5rem, 3vw, 2.5rem);

  .details > div {
    padding: 1.1rem 0;
    border-top: 1px solid ${HAIR};
  }
  .details small {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.7rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${DIM};
  }
  .details a,
  .details span {
    color: ${MINT};
    text-decoration: none;
  }
  .details .mail {
    font-size: clamp(1.2rem, 2.2vw, 1.8rem);
    text-decoration: underline;
    text-underline-offset: 0.25em;
    text-decoration-color: rgba(231, 250, 236, 0.4);
  }
  .details .links {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-size: 1.05rem;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const lagosTime = () =>
  new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Lagos', hour: '2-digit', minute: '2-digit' }).format(new Date())

const Contact = () => {
  const [time, setTime] = useState('--:--')
  useEffect(() => {
    setTime(lagosTime())
    const id = setInterval(() => setTime(lagosTime()), 15000)
    return () => clearInterval(id)
  }, [])

  const ref = useReveal<HTMLDivElement>(({ q, reduce }) => {
    if (reduce) return
    q('.label').forEach((l) => drawRule(l.querySelector('.rule'), l, 'top 90%'))
    const rows = q('.details > div')
    if (rows.length) fadeUp(rows, q('.details')[0], 'top 90%')
    const fields = q('form > *')
    if (fields.length) fadeUp(fields, q('form')[0], 'top 90%')
  })

  return (
    <PageShell
      title="Contact"
      description="Looking for a freelance software developer? Get in touch with Godswill Francis to discuss your project."
      footer="minimal"
    >
      <div ref={ref}>
        <PageHero
          label="(01) — Contact"
          meta="Open to new projects"
          lines={[{ text: 'Let’s work' }, { text: 'together.', out: true }]}
        >
          Are you looking for a freelance software developer? Do you have a
          project, an idea to realize? Send a message and let’s talk. I’m at
          your disposal.
        </PageHero>

        <Section style={{ paddingTop: 0 }}>
          <SectionLabel className="label">
            <span>(02) — Say hello</span>
            <span />
            <span className="rule" />
          </SectionLabel>
          <Grid>
            <div className="details">
              <div>
                <small>Email</small>
                <a className="mail" href={`mailto:${EMAIL}`}>
                  {EMAIL}
                </a>
              </div>
              <div>
                <small>Follow</small>
                <div className="links">
                  <a href="https://github.com/willzfrank" target="_blank" rel="noreferrer">
                    GitHub ↗
                  </a>
                  <a href="https://twitter.com/willzfrank001" target="_blank" rel="noreferrer">
                    Twitter ↗
                  </a>
                  <a href="https://www.linkedin.com/in/godswill-udoh/" target="_blank" rel="noreferrer">
                    LinkedIn ↗
                  </a>
                </div>
              </div>
              <div>
                <small>Based in</small>
                <span>Lagos, Nigeria — {time} WAT</span>
              </div>
            </div>
            <ContactForm />
          </Grid>
        </Section>
      </div>
    </PageShell>
  )
}

export default Contact
