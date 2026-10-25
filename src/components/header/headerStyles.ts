import styled, { keyframes } from 'styled-components';

const MINT = 'rgb(231, 250, 236)';
const HAIR = 'rgba(231, 250, 236, 0.16)';
const DIM = 'rgba(231, 250, 236, 0.55)';

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(61, 220, 132, 0.55); }
  50% { box-shadow: 0 0 0 6px rgba(61, 220, 132, 0); }
`;

const scrollLine = keyframes`
  0% { transform: scaleY(0); transform-origin: top; }
  50% { transform: scaleY(1); transform-origin: top; }
  51% { transform: scaleY(1); transform-origin: bottom; }
  100% { transform: scaleY(0); transform-origin: bottom; }
`;

/* Visually hidden but readable by search engines and screen readers. */
export const SrOnly = styled.h1`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`;

export const Hero = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: calc(100vh - 90px);
  padding: 1.25rem 0 2rem;
  /* hidden until GSAP takes over (a <noscript> rule in _document undoes this) */
  visibility: hidden;
`;

/* ---------- glyph portrait ---------- */
export const PortraitArea = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 215px;
  width: 52%;
  z-index: 0;
  pointer-events: none;
  /* melt into the page on the left and bottom */
  -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 28%),
    linear-gradient(to top, transparent 0%, #000 22%);
  -webkit-mask-composite: source-in;
  mask-image: linear-gradient(to right, transparent 0%, #000 28%),
    linear-gradient(to top, transparent 0%, #000 22%);
  mask-composite: intersect;

  .ascii-wrap {
    position: absolute;
    inset: 0;
  }
  .ascii-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  .ascii-lens {
    --x: -999px;
    --y: -999px;
    --r: 0px;
    position: absolute;
    inset: 0;
    background: url('/profile-hero.jpeg') 50% 22% / cover no-repeat;
    filter: grayscale(1) contrast(1.1) brightness(0.8);
    -webkit-mask-image: radial-gradient(
      circle var(--r) at var(--x) var(--y),
      #000 0%,
      #000 55%,
      transparent 100%
    );
    mask-image: radial-gradient(
      circle var(--r) at var(--x) var(--y),
      #000 0%,
      #000 55%,
      transparent 100%
    );
  }

  @media (max-width: 700px) {
    width: 100%;
    bottom: 26%;
    -webkit-mask-image: linear-gradient(to bottom, #000 55%, transparent 100%);
    mask-image: linear-gradient(to bottom, #000 55%, transparent 100%);
    opacity: 0.85;
  }
`;

/* ---------- top meta ---------- */
export const TopMeta = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${HAIR};
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  line-height: 1.7;

  .dim {
    color: ${DIM};
  }
  .meta-right {
    text-align: right;
  }
  .avail {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    white-space: nowrap;
  }
  .avail i {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #3ddc84;
    animation: ${pulse} 2s infinite;
  }

  @media (max-width: 700px) {
    font-size: 0.62rem;
    letter-spacing: 0.12em;
    .coords {
      display: none;
    }
  }
`;

/* ---------- name ---------- */
export const Lower = styled.div`
  position: relative;
  z-index: 2;
  margin-top: auto;
`;

export const Giant = styled.div`
  color: ${MINT};
  font-family: 'Playfair Display SC', serif;
  font-weight: 700;
  font-size: min(10.8vw, 22vh);
  line-height: 0.9;
  letter-spacing: -0.025em;
  user-select: none;
  padding-bottom: 0.18em;

  .line {
    display: block;
    width: fit-content;
    will-change: transform;
  }
  .line.second {
    padding-left: 0.9em;
  }
  .line.second span {
    color: transparent;
    -webkit-text-stroke: 1.5px ${MINT};
  }

  @media (max-width: 700px) {
    font-size: 15vw;
    .line.second {
      padding-left: 0.5em;
    }
  }
`;

/* ---------- bottom row ---------- */
export const BottomRow = styled.div`
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.8fr);
  align-items: end;
  gap: 3rem;
  padding-top: 1.25rem;
  border-top: 1px solid ${HAIR};

  .about {
    max-width: 36ch;
    font-size: 1.05rem;
    line-height: 1.55;
    color: rgba(231, 250, 236, 0.82);
  }
  .scroll {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    margin-top: 1.4rem;
    font-size: 0.72rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${DIM};
  }
  .scroll span {
    display: block;
    width: 1px;
    height: 34px;
    background: ${MINT};
    animation: ${scrollLine} 2.2s cubic-bezier(0.76, 0, 0.24, 1) infinite;
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: 1.2rem;
    .about {
      font-size: 0.95rem;
    }
  }
`;

export const WorkList = styled.div`
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;

  .head {
    display: flex;
    justify-content: space-between;
    padding-bottom: 0.7rem;
    color: ${DIM};
  }

  a {
    position: relative;
    display: grid;
    grid-template-columns: 2.2rem 1fr auto;
    align-items: baseline;
    gap: 0.5rem;
    padding: 0.8rem 0;
    border-top: 1px solid ${HAIR};
    color: ${MINT};
    text-decoration: none;
    overflow: hidden;
  }
  a .n {
    color: ${DIM};
  }
  a .t {
    font-family: 'Playfair Display SC', serif;
    font-size: 1.35rem;
    letter-spacing: 0.02em;
    text-transform: none;
    transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  }
  a .k {
    color: ${DIM};
    transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), color 0.3s;
  }
  a:hover .t {
    transform: translateX(0.6rem);
  }
  a:hover .k {
    color: ${MINT};
    transform: translateX(-0.4rem);
  }

  @media (max-width: 700px) {
    display: none;
  }
`;
