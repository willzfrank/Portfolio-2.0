import styled from 'styled-components'
import { motion } from 'framer-motion'

const MINT = 'rgb(231, 250, 236)'

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  color: ${MINT};
  overflow: hidden;
  pointer-events: none;
`

export const Strips = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
`

export const Strip = styled(motion.div)`
  flex: 1;
  background: #1f1f1f;
  /* hide hairline gaps between panels */
  margin-right: -1px;
`

export const Stage = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
`

export const Greeting = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-family: 'MyFont', sans-serif;
  font-size: clamp(3rem, 9vw, 9rem);
  line-height: 1.1;
`

export const Dot = styled.span`
  width: 0.2em;
  height: 0.2em;
  border-radius: 50%;
  background: ${MINT};
`

export const NameLine = styled.h1`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  font-family: 'MyFont', sans-serif;
  font-size: clamp(2.2rem, 8vw, 8rem);
  line-height: 1.15;
  font-weight: 400;
  text-align: center;
`

export const Mask = styled.span<{ $space: boolean }>`
  display: inline-block;
  overflow: hidden;
  padding-bottom: 0.08em;
  width: ${(p) => (p.$space ? '0.35em' : 'auto')};
`

export const Letter = styled(motion.span)`
  display: inline-block;
  transform-origin: bottom left;
`

export const Role = styled(motion.p)`
  font-size: clamp(0.7rem, 1.2vw, 0.95rem);
  letter-spacing: 0.25em;
  text-transform: uppercase;
`

export const Corner = styled.span`
  position: absolute;
  font-size: 0.8rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  opacity: 0.55;
`

export const Counter = styled.span`
  position: absolute;
  font-family: 'MyFont', sans-serif;
  font-size: clamp(3rem, 8vw, 7rem);
  line-height: 1;
  font-variant-numeric: tabular-nums;
`
