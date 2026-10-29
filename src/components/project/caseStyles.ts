import styled from 'styled-components'
import { MINT, HAIR, DIM } from '@/components/home/homeStyles'

export const MetaGrid = styled.dl`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 2rem;
  margin: clamp(2rem, 4vw, 3.5rem) 0 0;
  padding-top: 1.5rem;
  border-top: 1px solid ${HAIR};

  dt {
    margin-bottom: 0.6rem;
    font-size: 0.7rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${DIM};
  }
  dd {
    margin: 0;
    font-size: 1.05rem;
    line-height: 1.55;
  }
  dd .links {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    align-items: flex-start;
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 520px) {
    gap: 1.4rem 1rem;
  }
`

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-top: clamp(1.5rem, 3vw, 2.5rem);

  a {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.95rem 1.5rem;
    border: 1px solid ${MINT};
    border-radius: 999px;
    color: ${MINT};
    font-size: 0.9rem;
    letter-spacing: 0.02em;
    text-decoration: none;
    transition: color 0.45s;
  }
  a::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
    background: ${MINT};
    transform: translateY(101%);
    transition: transform 0.55s cubic-bezier(0.7, 0, 0.2, 1);
  }
  a span {
    display: inline-block;
    transition: transform 0.45s;
  }
  a:hover {
    color: #1d1d1d;
  }
  a:hover::before {
    transform: translateY(0);
  }
  a:hover span {
    transform: translate(2px, -2px);
  }
  /* first button is the primary action */
  a:first-child {
    background: ${MINT};
    color: #1d1d1d;
  }
  a:first-child::before {
    background: transparent;
  }
  a:first-child:hover {
    background: transparent;
    color: ${MINT};
  }
`

export const Screens = styled.div`
  display: flex;
  gap: clamp(0.8rem, 2vw, 1.5rem);
  margin-top: clamp(1.5rem, 3vw, 2.5rem);
  padding-bottom: 1rem;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
  &.dragging {
    scroll-snap-type: none;
    user-select: none;
  }
  figure {
    position: relative;
    flex: 0 0 auto;
    height: min(72vh, 640px);
    margin: 0;
    aspect-ratio: 777 / 1688;
    border-radius: 26px;
    overflow: hidden;
    background: #2b2b2b;
    scroll-snap-align: start;
  }
  /* staggered rhythm, like a contact sheet */
  figure:nth-child(even) {
    margin-top: clamp(1.5rem, 4vw, 3.5rem);
  }
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
  }

  @media (max-width: 700px) {
    figure {
      height: min(62vh, 520px);
    }
  }
`

export const Cover = styled.div`
  position: relative;
  margin-top: clamp(1rem, 3vw, 2rem);
  aspect-ratio: 16 / 10;
  border-radius: 6px;
  overflow: hidden;
  background: #2b2b2b;
  clip-path: inset(0 0 0 0);

  .inner {
    position: absolute;
    inset: 0;
  }
  img {
    object-fit: cover;
    object-position: top;
  }
`

export const Story = styled.div`
  margin-top: clamp(2rem, 5vw, 4rem);

  .lead {
    margin: 0 0 clamp(2.5rem, 6vw, 5rem);
    font-size: clamp(1.6rem, 3.2vw, 3.2rem);
    line-height: 1.22;
    letter-spacing: -0.012em;
    font-weight: 500;
    max-width: 28ch;
    max-width: none;
  }
  .cols {
    column-count: 2;
    column-gap: clamp(2rem, 5vw, 5rem);
    font-size: 1.1rem;
    line-height: 1.7;
    color: rgba(231, 250, 236, 0.82);
  }
  .cols p {
    margin: 0 0 1.4rem;
    break-inside: avoid;
  }

  @media (max-width: 800px) {
    .cols {
      column-count: 1;
    }
  }
`

export const Credits = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(2rem, 5vw, 5rem);
  margin-top: clamp(1.5rem, 3vw, 2.5rem);

  h3 {
    margin: 0 0 1rem;
    font-size: 0.7rem;
    font-weight: 400;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${DIM};
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.95rem 0;
    border-top: 1px solid ${HAIR};
    font-size: 1.1rem;
  }
  li:last-child {
    border-bottom: 1px solid ${HAIR};
  }
  li small {
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${DIM};
  }
  li a {
    color: ${MINT};
    text-decoration: underline;
    text-underline-offset: 0.25em;
    text-decoration-color: rgba(231, 250, 236, 0.4);
  }

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`

export const Gallery = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(1.2rem, 3vw, 2.5rem);
  margin-top: clamp(1.5rem, 3vw, 2.5rem);

  figure {
    margin: 0;
    width: 100%;
  }
  figure.portrait {
    width: min(100%, 62%);
  }
  figure.portrait:nth-child(even) {
    margin-left: auto;
  }
  .frame {
    position: relative;
    overflow: hidden;
    border-radius: 6px;
    background: #2b2b2b;
    clip-path: inset(0 0 0 0);
  }
  .frame img {
    display: block;
    width: 100%;
    height: auto;
  }

  @media (max-width: 700px) {
    figure.portrait {
      width: 100%;
    }
  }
`

export const NextProject = styled.section`
  padding: clamp(3rem, 7vw, 6rem) 0 clamp(1rem, 3vw, 2rem);

  a.big {
    position: relative;
    display: block;
    margin-top: clamp(1.5rem, 3vw, 2.5rem);
    padding: clamp(1.2rem, 3vw, 2.5rem) 0;
    border-top: 1px solid ${HAIR};
    border-bottom: 1px solid ${HAIR};
    color: ${MINT};
    text-decoration: none;
    overflow: hidden;
  }
  a.big .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
  }
  a.big .t {
    font-family: 'Playfair Display SC', serif;
    font-weight: 700;
    font-size: clamp(2.4rem, 8vw, 9rem);
    line-height: 1;
    letter-spacing: -0.02em;
    transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  }
  a.big .arrow {
    font-size: clamp(2rem, 6vw, 6rem);
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }
  a.big:hover .t {
    transform: translateX(2vw);
  }
  a.big:hover .arrow {
    transform: translate(0.5rem, -0.5rem);
  }
`

/* Same language as MetaGrid: hairline on top, small caps labels, no card. */
export const Highlights = styled.aside`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 2rem;
  margin-top: clamp(2rem, 4vw, 3.5rem);
  padding-top: 1.5rem;
  border-top: 1px solid ${HAIR};

  h2 {
    margin: 0 0 0.6rem;
    font-size: 0.7rem;
    font-weight: 400;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${DIM};
  }
  p {
    margin: 0;
    font-size: 1.05rem;
    line-height: 1.55;
  }
  .outcomes {
    grid-column: 1 / -1;
  }
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  li {
    padding: 0.55rem 0;
    border-bottom: 1px solid ${HAIR};
    font-size: 1.05rem;
    line-height: 1.5;
  }
  li:first-child {
    padding-top: 0;
  }
  li:last-child {
    border-bottom: 0;
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    .outcomes {
      grid-column: 1 / -1;
    }
  }
  @media (max-width: 520px) {
    gap: 1.4rem 1rem;
  }
`

export const HireStrip = styled.section`
  padding: clamp(3rem, 7vw, 6rem) 0 0;

  .box {
    margin-top: clamp(1.5rem, 3vw, 2.5rem);
    padding: clamp(1.5rem, 3vw, 2.5rem) 0;
    border-top: 1px solid ${HAIR};
    border-bottom: 1px solid ${HAIR};
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    flex-wrap: wrap;
  }
  h2 {
    margin: 0;
    font-family: 'Playfair Display SC', serif;
    font-weight: 700;
    font-size: clamp(2rem, 5vw, 4.5rem);
    line-height: 1.05;
    letter-spacing: -0.02em;
    color: ${MINT};
  }
  p {
    margin: 0.8rem 0 0;
    max-width: 34rem;
    color: ${DIM};
    line-height: 1.55;
  }
  .form-link {
    display: inline-block;
    margin-top: 1rem;
    color: ${MINT};
    font-size: 0.95rem;
    text-decoration: underline;
    text-underline-offset: 0.3em;
    text-decoration-color: rgba(231, 250, 236, 0.4);
  }
  .quick {
    list-style: none;
    margin: 0;
    padding: 0;
    width: min(100%, 26rem);
  }
  .quick li {
    border-top: 1px solid ${HAIR};
  }
  .quick li:last-child {
    border-bottom: 1px solid ${HAIR};
  }
  .quick a {
    display: grid;
    grid-template-columns: 5.5rem 1fr auto;
    align-items: baseline;
    gap: 1rem;
    padding: 0.95rem 0;
    color: ${MINT};
    text-decoration: none;
    font-size: 1.05rem;
    transition: padding-left 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .quick small {
    font-size: 0.7rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${DIM};
  }
  .quick i {
    font-style: normal;
    transition: transform 0.4s;
  }
  .quick a:hover {
    padding-left: 0.6rem;
  }
  .quick a:hover i {
    transform: translate(2px, -2px);
  }
  @media (max-width: 700px) {
    .quick {
      width: 100%;
    }
  }
`

export const Process = styled.div`
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
  h3 {
    margin: 0;
    font-size: 0.7rem;
    font-weight: 400;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${DIM};
  }
  p {
    margin: 0;
    max-width: 52rem;
    font-size: 1.1rem;
    line-height: 1.7;
    color: rgba(231, 250, 236, 0.82);
  }
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 1.1rem;
    line-height: 1.7;
  }

  @media (max-width: 700px) {
    .row {
      grid-template-columns: 1fr;
      gap: 0.6rem;
    }
  }
`
