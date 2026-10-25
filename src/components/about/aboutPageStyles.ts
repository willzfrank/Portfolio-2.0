import styled from 'styled-components'
import { MINT, HAIR, DIM } from '@/components/home/homeStyles'

export const BioGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.4fr);
  gap: clamp(2rem, 6vw, 6rem);
  align-items: start;
  margin-top: clamp(1.5rem, 3vw, 2.5rem);

  .portrait {
    position: sticky;
    top: 7rem;
    aspect-ratio: 4 / 5;
    border-radius: 6px;
    overflow: hidden;
    background: #2b2b2b;
    clip-path: inset(0 0 0 0);
  }
  .portrait .inner {
    position: absolute;
    inset: -8% 0;
  }
  .portrait img {
    object-fit: cover;
    object-position: 50% 28%;
    filter: grayscale(1) contrast(1.05) brightness(0.85);
  }
  .lead {
    margin: 0;
    font-size: clamp(1.5rem, 2.7vw, 2.7rem);
    line-height: 1.25;
    letter-spacing: -0.01em;
    font-weight: 500;
  }
  .second {
    max-width: 52ch;
    margin: clamp(2rem, 4vw, 3.5rem) 0 0;
    font-size: 1.1rem;
    line-height: 1.7;
    color: rgba(231, 250, 236, 0.78);
  }
  .second a {
    color: ${MINT};
    text-underline-offset: 0.25em;
  }

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    .portrait {
      position: relative;
      top: 0;
      max-width: 420px;
    }
  }
`

export const ExpList = styled.div`
  margin-top: clamp(1.5rem, 3vw, 2.5rem);

  .row {
    position: relative;
    display: grid;
    grid-template-columns: 3rem minmax(0, 1.4fr) minmax(0, 1fr) auto;
    align-items: baseline;
    gap: 1.5rem;
    padding: clamp(1rem, 2vw, 1.6rem) 0;
    border-top: 1px solid ${HAIR};
    transition: opacity 0.5s ease, padding 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .row:last-child {
    border-bottom: 1px solid ${HAIR};
  }
  .row .n {
    font-size: 0.72rem;
    letter-spacing: 0.16em;
    color: ${DIM};
  }
  .row .role {
    font-family: 'Playfair Display SC', serif;
    font-weight: 700;
    font-size: clamp(1.3rem, 2.6vw, 2.4rem);
    line-height: 1.1;
  }
  .row .co {
    font-size: 1.05rem;
    color: rgba(231, 250, 236, 0.85);
  }
  .row .when {
    text-align: right;
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${DIM};
    white-space: nowrap;
  }

  @media (hover: hover) {
    &:hover .row {
      opacity: 0.3;
    }
    &:hover .row:hover {
      opacity: 1;
      padding-left: 1.2rem;
    }
  }

  @media (max-width: 800px) {
    .row {
      grid-template-columns: 2rem 1fr;
      row-gap: 0.3rem;
    }
    .row .co,
    .row .when {
      grid-column: 2;
      text-align: left;
    }
  }
`

export const SkillGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: clamp(1.5rem, 3vw, 2.5rem);
  border-top: 1px solid ${HAIR};
  border-left: 1px solid ${HAIR};

  span {
    display: flex;
    align-items: center;
    min-height: clamp(4.5rem, 8vw, 7rem);
    padding: 1rem 1.2rem;
    border-right: 1px solid ${HAIR};
    border-bottom: 1px solid ${HAIR};
    font-family: 'Playfair Display SC', serif;
    font-weight: 700;
    font-size: clamp(1.05rem, 1.8vw, 1.6rem);
    line-height: 1.1;
    transition: background 0.45s cubic-bezier(0.22, 1, 0.36, 1), color 0.45s;
  }
  span:hover {
    background: ${MINT};
    color: #1f1f1f;
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`
