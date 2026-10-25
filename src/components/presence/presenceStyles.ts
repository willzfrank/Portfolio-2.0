import styled from 'styled-components'
import { motion } from 'framer-motion'

/** Fixed bottom-left anchor; every card is pinned to the same spot and stacks. */
export const Stack = styled.div`
  position: fixed;
  left: 16px;
  bottom: 16px;
  z-index: 9998;
  width: 260px;
  height: 0;
  pointer-events: none;
`

export const Toast = styled(motion.div)`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.1rem;
  border-radius: 12px;
  background: rgba(24, 24, 24, 0.94);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  transform-origin: 50% 100%;
  strong {
    display: block;
    font-size: 0.95rem;
    font-weight: 500;
  }
  span {
    font-family: ui-monospace, monospace;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.6);
  }
`

export const Dot = styled.i<{ $kind: 'join' | 'leave' }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${(p) => (p.$kind === 'join' ? '#3ddc84' : '#ff6b6b')};
`
