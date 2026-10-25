import styled from 'styled-components';

export const MINT = 'rgb(231, 250, 236)';
export const INK = '#1f1f1f';
export const HAIR = 'rgba(231, 250, 236, 0.16)';
export const DIM = 'rgba(231, 250, 236, 0.55)';

export const Chapter = styled.section`
  position: relative;
  padding: clamp(4rem, 9vw, 8rem) 0;
  text-align: left;
  hyphens: none;
  word-break: normal;
  overflow-wrap: normal;
`;

export const Label = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 1rem;
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${DIM};

  .rule {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: ${HAIR};
    transform-origin: left;
  }
`;

/* ---------------- manifesto ---------------- */
export const ManifestoText = styled.p`
  margin: clamp(2.5rem, 6vw, 5rem) 0 0;
  font-size: clamp(1.7rem, 3.5vw, 3.5rem);
  line-height: 1.22;
  letter-spacing: -0.012em;
  font-weight: 500;
  text-indent: 14vw;
  text-align: left;
  word-spacing: normal;

  /* split words are inline-blocks: don't let them inherit the first-line indent */
  div,
  span {
    text-indent: 0;
  }

  @media (max-width: 700px) {
    text-indent: 2.2rem;
    font-size: 1.55rem;
  }
`;

export const Facts = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: clamp(3rem, 7vw, 6rem);
  padding-top: 1.5rem;
  border-top: 1px solid ${HAIR};

  small {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.7rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${DIM};
  }
  div {
    font-size: 1.05rem;
    line-height: 1.5;
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: 1.4rem;
  }
`;

export const LinkArrow = styled.a`
  position: relative;
  display: inline-block;
  margin-top: clamp(2rem, 5vw, 4rem);
  font-size: 0.8rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${MINT};
  text-decoration: none;
  padding-bottom: 0.35rem;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: ${MINT};
    transform-origin: right;
    transition: transform 0.6s cubic-bezier(0.76, 0, 0.24, 1);
  }
  &:hover::after {
    transform: scaleX(0);
  }
  span {
    display: inline-block;
    transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  }
  &:hover span {
    transform: translate(0.25rem, -0.25rem);
  }
`;

/* ---------------- work index ---------------- */
export const WorkList = styled.div`
  margin-top: 0.5rem;

  .row {
    position: relative;
    display: grid;
    grid-template-columns: 3.5rem minmax(0, 1fr) auto;
    align-items: center;
    gap: 1.5rem;
    padding: clamp(1.1rem, 2.2vw, 2rem) 0;
    border-top: 1px solid ${HAIR};
    color: ${MINT};
    text-decoration: none;
    transition: opacity 0.5s ease;
  }
  .row:first-child {
    border-top: 0;
  }
  .row:last-child {
    border-bottom: 1px solid ${HAIR};
  }
  .row .n {
    font-size: 0.72rem;
    letter-spacing: 0.16em;
    color: ${DIM};
  }
  .row .title {
    font-family: 'Playfair Display SC', serif;
    font-weight: 700;
    font-size: clamp(2.3rem, 5.6vw, 6.4rem);
    line-height: 1;
    letter-spacing: -0.02em;
    min-width: 0;
    transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .row .meta {
    text-align: right;
    font-size: 0.72rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${DIM};
    line-height: 1.8;
  }
  .row .arrow {
    display: inline-block;
    margin-left: 0.4rem;
    transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  }

  @media (hover: hover) {
    &:hover .row {
      opacity: 0.28;
    }
    &:hover .row:hover {
      opacity: 1;
    }
    .row:hover .title {
      transform: translateX(2.2vw);
    }
    .row:hover .arrow {
      transform: translate(0.3rem, -0.3rem);
    }
  }

  @media (max-width: 700px) {
    .row {
      grid-template-columns: 2rem 1fr;
      row-gap: 0.4rem;
    }
    .row .meta {
      grid-column: 2;
      text-align: left;
    }
  }
`;

export const Preview = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: clamp(240px, 24vw, 380px);
  aspect-ratio: 4 / 3;
  border-radius: 6px;
  overflow: hidden;
  z-index: 9000;
  pointer-events: none;
  opacity: 0;
  background: #2b2b2b;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
    opacity: 0;
    transform: scale(1.15);
    transition: opacity 0.4s ease, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
  }
  img.on {
    opacity: 1;
    transform: scale(1);
  }

  @media (hover: none) {
    display: none;
  }
`;

/* ---------------- ticker ---------------- */
export const TickerWrap = styled.section`
  position: relative;
  overflow: hidden;
  padding: clamp(2rem, 4vw, 3.5rem) 0;
  border-top: 1px solid ${HAIR};
  border-bottom: 1px solid ${HAIR};
`;

export const TickerRow = styled.div`
  display: flex;
  width: max-content;
  will-change: transform;

  .item {
    display: flex;
    align-items: center;
    gap: clamp(1.5rem, 3vw, 3rem);
    padding-right: clamp(1.5rem, 3vw, 3rem);
    font-family: 'Playfair Display SC', serif;
    font-weight: 700;
    font-size: clamp(3rem, 9vw, 9rem);
    line-height: 1.05;
    white-space: nowrap;
  }
  &.outline .item span {
    color: transparent;
    -webkit-text-stroke: 1.5px ${MINT};
  }
  .item i {
    font-style: normal;
    font-size: 0.4em;
    opacity: 0.55;
  }
`;

/* ---------------- contact / footer ---------------- */
export const ContactWrap = styled.section`
  position: relative;
  overflow: hidden;
  margin-top: clamp(4rem, 8vw, 7rem);
  padding: clamp(4rem, 9vw, 8rem) 2.5vw 0;
  background: ${MINT};
  color: ${INK};
  border-radius: clamp(1.5rem, 4vw, 3.5rem) clamp(1.5rem, 4vw, 3.5rem) 0 0;

  .inner {
    max-width: 1368px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }
`;

export const ContactLabel = styled(Label)`
  color: rgba(31, 31, 31, 0.6);
  .rule {
    background: rgba(31, 31, 31, 0.2);
  }
`;

export const BigLine = styled.h2`
  margin: clamp(2rem, 5vw, 4rem) 0 0;
  font-family: 'Playfair Display SC', serif;
  font-weight: 700;
  font-size: clamp(3rem, 10.5vw, 11rem);
  line-height: 0.95;
  letter-spacing: -0.025em;

  .l {
    display: block;
    width: fit-content;
  }
  .l.out {
    color: transparent;
    -webkit-text-stroke: 2px ${INK};
  }
  @media (max-width: 700px) {
    .l.out {
      -webkit-text-stroke: 1.2px ${INK};
    }
  }
`;

export const CtaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2.5rem;
  margin-top: clamp(2.5rem, 5vw, 4rem);
  padding-bottom: clamp(2.5rem, 5vw, 4rem);

  .mail {
    font-size: clamp(1.1rem, 2.4vw, 2rem);
    color: ${INK};
    text-decoration: none;
    position: relative;
    padding-bottom: 0.3rem;
  }
  .mail::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: ${INK};
    transform-origin: right;
    transition: transform 0.6s cubic-bezier(0.76, 0, 0.24, 1);
  }
  .mail:hover::after {
    transform: scaleX(0);
  }
`;

export const Magnetic = styled.div`
  width: clamp(120px, 14vw, 170px);
  height: clamp(120px, 14vw, 170px);

  a {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: ${INK};
    color: ${MINT};
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    text-decoration: none;
    text-align: center;
    transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  }
  a:hover {
    transform: scale(1.06);
  }
`;

export const FootGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 2rem;
  padding: 1.5rem 0 2rem;
  border-top: 1px solid rgba(31, 31, 31, 0.2);
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;

  small {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.68rem;
    color: rgba(31, 31, 31, 0.55);
  }
  a,
  button {
    display: block;
    width: fit-content;
    color: ${INK};
    text-decoration: none;
    background: none;
    border: 0;
    padding: 0;
    font: inherit;
    letter-spacing: inherit;
    text-transform: inherit;
    line-height: 1.9;
    cursor: pointer;
    transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  }
  a:hover,
  button:hover {
    transform: translateX(0.35rem);
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const Legal = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1368px;
  margin: 0 auto;
  padding: 1.2rem 0 1.5rem;
  border-top: 1px solid rgba(31, 31, 31, 0.2);
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  color: rgba(31, 31, 31, 0.65);
`;

export const Wordmark = styled.div`
  position: relative;
  margin-top: 0.5rem;
  font-family: 'Playfair Display SC', serif;
  font-weight: 700;
  font-size: 8.3vw;
  line-height: 0.8;
  letter-spacing: -0.03em;
  text-align: center;
  white-space: nowrap;
  color: rgba(31, 31, 31, 0.09);
  user-select: none;
  pointer-events: none;
`;

export const Progress = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 9991;
  background: ${MINT};
  transform: scaleX(0);
  transform-origin: left;
  pointer-events: none;
`;
