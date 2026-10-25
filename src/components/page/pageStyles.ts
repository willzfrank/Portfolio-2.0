import styled from 'styled-components'
import { MINT, HAIR, DIM } from '@/components/home/homeStyles'

export const Hero = styled.section`
  position: relative;
  padding: clamp(2.5rem, 6vw, 5rem) 0 clamp(2.5rem, 6vw, 5rem);

  .top {
    position: relative;
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding-bottom: 1rem;
    font-size: 0.72rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${DIM};
  }
  .top .rule {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: ${HAIR};
    transform-origin: left;
  }
  .top a {
    color: ${MINT};
    text-decoration: none;
  }
`

export const Title = styled.h1`
  margin: clamp(2rem, 5vw, 4rem) 0 0;
  font-family: 'Playfair Display SC', serif;
  font-weight: 700;
  font-size: clamp(3rem, 11vw, 12rem);
  line-height: 0.95;
  letter-spacing: -0.025em;
  text-align: left;
  hyphens: none;
  word-break: normal;
  overflow-wrap: normal;

  .l {
    display: block;
    width: fit-content;
  }
  .l.out {
    color: transparent;
    -webkit-text-stroke: 1.5px ${MINT};
  }

  &.long {
    font-size: clamp(2.8rem, 9vw, 10rem);
  }
`

export const Intro = styled.p`
  max-width: 44ch;
  margin-top: clamp(1.5rem, 3vw, 2.5rem);
  font-size: clamp(1.05rem, 1.6vw, 1.4rem);
  line-height: 1.55;
  color: rgba(231, 250, 236, 0.82);
`

export const Section = styled.section`
  position: relative;
  padding: clamp(3rem, 7vw, 6rem) 0;
  text-align: left;
  hyphens: none;
  word-break: normal;
  overflow-wrap: normal;
`

export const SectionLabel = styled.div`
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
`

export const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: clamp(1.8rem, 3vw, 2.6rem);

  button {
    padding: 0.55rem 1.1rem;
    border: 1px solid ${HAIR};
    border-radius: 999px;
    background: transparent;
    color: ${DIM};
    font: inherit;
    font-size: 0.72rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  }
  button:hover {
    color: ${MINT};
    border-color: rgba(231, 250, 236, 0.5);
  }
  button.on {
    background: ${MINT};
    border-color: ${MINT};
    color: #1f1f1f;
  }
`

export const LinkOut = styled.a`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 0.35rem;
  font-size: 0.8rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${MINT};
  text-decoration: none;

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
`
