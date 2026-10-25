import styled, { keyframes } from 'styled-components'

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(12px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`

export const Toast = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 220px;
  padding: 0.85rem 1.1rem;
  border-radius: 12px;
  background: rgba(24, 24, 24, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  animation: ${slideIn} 0.3s ease-out;
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
