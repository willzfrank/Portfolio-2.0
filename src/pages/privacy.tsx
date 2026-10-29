import React from 'react'
import styled from 'styled-components'
import { useReveal, fadeUp } from '@/lib/useReveal'
import PageShell from '@/components/page/PageShell'
import PageHero from '@/components/page/PageHero'
import { Section, SectionLabel } from '@/components/page/pageStyles'
import { MINT, DIM, HAIR } from '@/components/home/homeStyles'

const EMAIL = 'willzudoh4@gmail.com'
const UPDATED = '29 October 2026'

const Rows = styled.div`
  margin-top: clamp(1.5rem, 3vw, 2.5rem);

  .row {
    display: grid;
    grid-template-columns: minmax(8rem, 1fr) 3fr;
    gap: clamp(1rem, 4vw, 4rem);
    padding: clamp(1.2rem, 2.5vw, 2rem) 0;
    border-top: 1px solid ${HAIR};
  }
  .row:last-child {
    border-bottom: 1px solid ${HAIR};
  }
  h2 {
    margin: 0;
    font-size: 0.7rem;
    font-weight: 400;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${DIM};
  }
  p,
  li {
    max-width: 52rem;
    font-size: 1.1rem;
    line-height: 1.7;
    color: rgba(231, 250, 236, 0.82);
  }
  p {
    margin: 0 0 0.8rem;
  }
  p:last-child {
    margin: 0;
  }
  ul {
    margin: 0;
    padding-left: 1.2rem;
  }
  a {
    color: ${MINT};
    text-underline-offset: 0.25em;
    text-decoration-color: rgba(231, 250, 236, 0.4);
  }

  @media (max-width: 700px) {
    .row {
      grid-template-columns: 1fr;
      gap: 0.6rem;
    }
  }
`

const Privacy = () => {
  const ref = useReveal<HTMLDivElement>(({ q, reduce }) => {
    if (reduce) return
    const rows = q('.row')
    if (rows.length) fadeUp(rows, q('.rows')[0], 'top 88%')
  })

  return (
    <PageShell
      title="Privacy"
      description="What this site collects, why, and how to ask for it to be removed."
      footer="minimal"
    >
      <div ref={ref}>
        <PageHero
          label="Privacy"
          meta={`Updated ${UPDATED}`}
          lines={[{ text: 'Your privacy' }]}
        >
          Short version: no cookies, no IP addresses stored, nothing sold, and you can ask me to delete anything.
        </PageHero>

        <Section>
          <SectionLabel className="label">
            <span>The details</span>
            <span />
            <span className="rule" />
          </SectionLabel>
          <Rows className="rows">
            <div className="row">
              <h2>What I measure</h2>
              <div>
                <p>
                  To see which projects are useful and what to fix, the site records anonymous visit details:
                </p>
                <ul>
                  <li>pages viewed, time spent, how far you scroll and which links you click (resume, email, social, project links)</li>
                  <li>country and city (from the hosting provider, not from your IP address), device, browser, operating system, language, time zone and screen width</li>
                  <li>where you came from (for example LinkedIn) and the tag on a link if I sent you one, like <i>?ref=company</i></li>
                  <li>errors and load speed, so I can fix problems</li>
                </ul>
              </div>
            </div>
            <div className="row">
              <h2>What I don&apos;t</h2>
              <p>
                I don&apos;t store your IP address, use cookies, use advertising trackers or build a profile of you. I
                don&apos;t try to work out who you are or which company you work for. If your browser sends Do Not Track,
                none of the above is recorded.
              </p>
            </div>
            <div className="row">
              <h2>Anonymous ID</h2>
              <p>
                Your browser keeps a random ID in its own storage (not a cookie) so I can tell a returning visit from a
                new one. It isn&apos;t linked to your name or email, and clearing your browser data removes it.
              </p>
            </div>
            <div className="row">
              <h2>Contact form</h2>
              <p>
                If you send a message, I store your name, email and message so I can reply, and it is emailed to me
                through Resend. I only use it to answer you.
              </p>
            </div>
            <div className="row">
              <h2>Who handles it</h2>
              <p>
                The site is hosted on Vercel, analytics and messages are stored in Supabase, and email goes through
                Resend. They process data on my behalf. I don&apos;t share it with anyone else.
              </p>
            </div>
            <div className="row">
              <h2>How long</h2>
              <p>Analytics are kept for up to 12 months. Messages are kept until you ask me to delete them.</p>
            </div>
            <div className="row">
              <h2>Your rights</h2>
              <p>
                Under Nigeria&apos;s NDPA and, if you are in the EU or UK, the GDPR, you can ask what I hold about you,
                have it corrected or deleted, or object to the analytics. Email{' '}
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a> and I will respond. Because analytics are anonymous, I may ask
                for the link you used or roughly when you visited to find your visit.
              </p>
            </div>
          </Rows>
        </Section>
      </div>
    </PageShell>
  )
}

export default Privacy
