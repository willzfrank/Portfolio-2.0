import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import PageShell from '@/components/page/PageShell'
import PageHero from '@/components/page/PageHero'
import { Section, SectionLabel } from '@/components/page/pageStyles'
import { Actions } from '@/components/project/caseStyles'
import { MINT, DIM, HAIR } from '@/components/home/homeStyles'

const Quick = styled.ul`
  list-style: none;
  margin: clamp(1.5rem, 3vw, 2.5rem) 0 0;
  padding: 0;

  li {
    border-top: 1px solid ${HAIR};
  }
  li:last-child {
    border-bottom: 1px solid ${HAIR};
  }
  a {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    padding: 1.1rem 0;
    color: ${MINT};
    text-decoration: none;
    font-size: clamp(1.2rem, 2.4vw, 1.8rem);
    transition: padding-left 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  }
  small {
    font-size: 0.7rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${DIM};
  }
  a:hover {
    padding-left: 0.8rem;
  }
`

const NotFound = () => (
  <PageShell
    title="Page not found"
    description="This page doesn't exist."
    footer="minimal"
  >
    <PageHero
      label="Error"
      meta="N°404"
      lines={[{ text: 'Lost' }, { text: 'page', out: true }]}
    >
      That link doesn&apos;t lead anywhere. It may have moved, or been mistyped. Here is where you probably meant to go.
    </PageHero>

    <Actions data-hero-in>
      <Link href="/" data-cursor="Home">
        Back home <span>→</span>
      </Link>
      <a href="/api/resume" download target="_blank" rel="noopener noreferrer" data-cursor="Open">
        Download resume <span>↗</span>
      </a>
    </Actions>

    <Section>
      <SectionLabel className="label">
        <span>Or try</span>
        <span />
        <span className="rule" />
      </SectionLabel>
      <Quick>
        <li>
          <Link href="/project" data-cursor="Open">
            Projects <small>Selected work</small>
          </Link>
        </li>
        <li>
          <Link href="/about" data-cursor="Open">
            About <small>Who I am</small>
          </Link>
        </li>
        <li>
          <Link href="/contact" data-cursor="Open">
            Contact <small>Say hello</small>
          </Link>
        </li>
      </Quick>
    </Section>
  </PageShell>
)

export default NotFound
