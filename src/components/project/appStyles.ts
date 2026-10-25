import styled from 'styled-components'
import { MINT, HAIR, DIM } from '@/components/home/homeStyles'

/** A CSS phone: bezel, dynamic island and a screen that fills with its children. */
export const Phone = styled.div`
  position: relative;
  aspect-ratio: 9 / 19.4;
  border-radius: 15% / 7%;
  padding: 2.4%;
  background: linear-gradient(145deg, #3a3a3a, #0b0b0b 40%, #1c1c1c);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.14) inset, 0 40px 90px -20px rgba(0, 0, 0, 0.7),
    0 12px 30px rgba(0, 0, 0, 0.45);

  .screen {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 12.5% / 5.8%;
    background: #111;
  }
  .screen img,
  .screen .shot {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
  }
  &::after {
    content: '';
    position: absolute;
    top: 3.6%;
    left: 50%;
    width: 27%;
    height: 2.2%;
    transform: translateX(-50%);
    border-radius: 999px;
    background: #000;
  }
`

/** Hero for app projects: two phones floating over a blurred wash of the product's own colours. */
export const Stage = styled.div`
  position: relative;
  margin-top: clamp(1rem, 3vw, 2rem);
  height: clamp(420px, 62vw, 760px);
  border-radius: 6px;
  overflow: hidden;
  background: #1b1b1b;
  clip-path: inset(0 0 0 0);

  .wash {
    position: absolute;
    inset: -20%;
    background-size: cover;
    background-position: center;
    filter: blur(80px) saturate(1.5) brightness(0.5);
    transform: scale(1.1);
  }
  .grain {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 110%, rgba(0, 0, 0, 0.55), transparent 60%),
      linear-gradient(90deg, rgba(0, 0, 0, 0.45), transparent 35%, transparent 65%, rgba(0, 0, 0, 0.45));
  }
  .phones {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .phone {
    position: absolute;
    height: 88%;
    will-change: transform;
  }
  .phone.back {
    transform: translateX(34%) rotate(8deg) scale(0.9);
    opacity: 0.92;
  }
  .phone.front {
    transform: translateX(-30%) rotate(-5deg);
  }
  .tag {
    position: absolute;
    left: clamp(1rem, 2.4vw, 2rem);
    bottom: clamp(1rem, 2.4vw, 2rem);
    font-size: 0.7rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${MINT};
    opacity: 0.8;
  }

  @media (max-width: 700px) {
    height: clamp(380px, 120vw, 560px);
    .phone.back {
      transform: translateX(42%) rotate(8deg) scale(0.88);
    }
    .phone.front {
      transform: translateX(-24%) rotate(-5deg);
    }
  }
`

/** Desktop: the phone stays put while the screens (and captions) change as you scroll. */
export const Pinned = styled.div`
  position: relative;
  height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: 4vw;

  .copy {
    position: relative;
  }
  .count {
    display: block;
    margin-bottom: 2rem;
    font-size: 0.72rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${DIM};
  }
  .count b {
    color: ${MINT};
    font-weight: 400;
  }
  .caps {
    position: relative;
    height: clamp(7rem, 16vw, 13rem);
  }
  .cap {
    position: absolute;
    inset: 0 auto auto 0;
    margin: 0;
    max-width: 14ch;
    font-family: 'Playfair Display SC', serif;
    font-weight: 700;
    font-size: clamp(2.4rem, 5.4vw, 5rem);
    line-height: 1;
    letter-spacing: -0.01em;
    color: ${MINT};
  }
  .dots {
    display: flex;
    gap: 0.5rem;
    margin-top: 2.2rem;
  }
  .dots i {
    width: 2.2rem;
    height: 2px;
    background: ${HAIR};
    transition: background 0.4s;
  }
  .dots i.on {
    background: ${MINT};
  }
  .device {
    justify-self: center;
    height: min(82vh, 760px);
  }
  .device ${Phone} {
    height: 100%;
  }
  .shot {
    will-change: clip-path;
  }

  /* phones: the strip below takes over */
  @media (max-width: 800px) {
    display: none;
  }
`

/** The horizontal strip is the mobile fallback when the pinned phone is on show. */
export const StripWrap = styled.div<{ $app: boolean }>`
  @media (min-width: 801px) {
    display: ${(p) => (p.$app ? 'none' : 'block')};
  }
`
