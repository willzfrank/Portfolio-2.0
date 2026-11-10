import styled, { keyframes } from 'styled-components'
import { motion } from 'framer-motion'
import { MINT, HAIR, DIM, INK } from '@/components/home/homeStyles'

const pulseAnimation = keyframes`
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
`

const bounceAnimation = keyframes`
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
`

/* Floating trigger pill button */
export const TriggerPill = styled(motion.button)`
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 9998;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px 10px 14px;
  background: rgba(28, 28, 28, 0.95);
  border: 1px solid ${HAIR};
  border-radius: 9999px;
  color: ${MINT};
  font-family: inherit;
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(12px);
  outline: none;
  transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;

  &:hover {
    border-color: rgba(231, 250, 236, 0.45);
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.6);
    transform: translateY(-2px);
  }

  @media (max-width: 600px) {
    right: 14px;
    bottom: 16px;
    padding: 9px 15px 9px 12px;
    font-size: 0.82rem;
  }
`

export const TriggerDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3ddc84;
  box-shadow: 0 0 10px #3ddc84;
  animation: ${pulseAnimation} 2s infinite ease-in-out;
  flex-shrink: 0;
`

export const TriggerSparkle = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 17px;
    height: 17px;
    fill: ${MINT};
  }
`

/* Mobile backdrop */
export const ChatBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 9997;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(2px);
  display: none;

  @media (max-width: 600px) {
    display: block;
  }
`

/* The floating modal chat panel */
export const ChatDialog = styled(motion.div)`
  position: fixed;
  right: 20px;
  bottom: 76px;
  z-index: 9999;
  width: 390px;
  max-width: calc(100vw - 32px);
  height: 560px;
  max-height: calc(100vh - 100px);
  background: rgba(22, 22, 22, 0.96);
  border: 1px solid rgba(231, 250, 236, 0.18);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  overscroll-behavior: contain;

  @media (max-width: 600px) {
    right: 12px;
    left: 12px;
    width: auto;
    bottom: 72px;
    height: min(560px, calc(100dvh - 84px));
    height: min(560px, calc(100vh - 84px));
    border-radius: 18px;
  }
`

/* Top header */
export const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: rgba(30, 30, 30, 0.7);
  border-bottom: 1px solid ${HAIR};

  .profile {
    display: flex;
    align-items: center;
    gap: 11px;
  }

  .avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: #111;
    border: 1px solid ${HAIR};
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex-shrink: 0;
    overflow: hidden;

    img {
      object-fit: cover;
    }
  }

  .status-dot {
    position: absolute;
    bottom: 1px;
    right: 1px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #3ddc84;
    border: 1.5px solid #1c1c1c;
  }

  .meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .name {
    font-size: 0.92rem;
    font-weight: 600;
    color: ${MINT};
    letter-spacing: -0.01em;
  }

  .subtitle {
    font-size: 0.72rem;
    color: ${DIM};
    font-family: ui-monospace, monospace;
    letter-spacing: 0.04em;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`

export const HeaderButton = styled.button`
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${DIM};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${MINT};
    background: rgba(255, 255, 255, 0.06);
    border-color: ${HAIR};
  }

  svg {
    width: 15px;
    height: 15px;
  }
`

/* Messages body */
export const ChatBody = styled.div`
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  scroll-behavior: smooth;

  /* Subtle dark scrollbar */
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 10px;
  }
`

export const WelcomeCard = styled.div`
  background: rgba(35, 35, 35, 0.6);
  border: 1px solid ${HAIR};
  border-radius: 14px;
  padding: 14px 16px;
  font-size: 0.88rem;
  line-height: 1.45;
  color: rgba(231, 250, 236, 0.9);

  p {
    margin-bottom: 8px;
  }

  .hint {
    font-size: 0.76rem;
    color: ${DIM};
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-family: ui-monospace, monospace;
  }
`

export const ChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 6px;
`

export const ChipButton = styled.button`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(231, 250, 236, 0.15);
  border-radius: 20px;
  padding: 6px 12px;
  color: ${MINT};
  font-size: 0.78rem;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  line-height: 1.3;

  &:hover {
    background: rgba(231, 250, 236, 0.12);
    border-color: ${MINT};
    transform: translateY(-1px);
  }
`

/* Message Rows & Bubbles */
export const MessageRow = styled.div<{ $isUser: boolean }>`
  display: flex;
  justify-content: ${(p) => (p.$isUser ? 'flex-end' : 'flex-start')};
  width: 100%;
`

export const MessageBubble = styled.div<{ $isUser: boolean }>`
  max-width: 86%;
  padding: 11px 15px;
  border-radius: ${(p) =>
    p.$isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px'};
  font-size: 0.88rem;
  line-height: 1.5;
  color: ${MINT};
  background: ${(p) =>
    p.$isUser
      ? 'linear-gradient(135deg, rgba(61, 220, 132, 0.2) 0%, rgba(40, 120, 80, 0.25) 100%)'
      : 'rgba(32, 32, 32, 0.85)'};
  border: 1px solid
    ${(p) => (p.$isUser ? 'rgba(61, 220, 132, 0.35)' : HAIR)};
  word-break: break-word;

  a {
    color: #3ddc84;
    text-decoration: underline;
    text-underline-offset: 3px;
    font-weight: 500;
  }

  p:not(:last-child) {
    margin-bottom: 8px;
  }

  ul {
    list-style: disc;
    padding-left: 18px;
    margin: 6px 0;
  }

  li {
    margin-bottom: 4px;
  }

  code {
    font-family: ui-monospace, monospace;
    font-size: 0.82em;
    background: rgba(0, 0, 0, 0.3);
    padding: 2px 5px;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
`

export const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 12px 16px;
  background: rgba(32, 32, 32, 0.85);
  border: 1px solid ${HAIR};
  border-radius: 16px 16px 16px 4px;
  width: fit-content;

  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${DIM};
    display: inline-block;
    animation: ${bounceAnimation} 1.2s infinite ease-in-out;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
`

/* Bottom input bar */
export const ChatFooter = styled.div`
  padding: 12px 14px 10px;
  border-top: 1px solid ${HAIR};
  background: rgba(26, 26, 26, 0.85);
`

export const InputForm = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(18, 18, 18, 0.9);
  border: 1px solid ${HAIR};
  border-radius: 12px;
  padding: 4px 6px 4px 12px;
  transition: border-color 0.2s;

  &:focus-within {
    border-color: rgba(231, 250, 236, 0.5);
  }

  input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: ${MINT};
    font-family: inherit;
    font-size: 0.86rem;

    &::placeholder {
      color: ${DIM};
    }
  }
`

export const SendButton = styled.button<{ $hasValue: boolean }>`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: none;
  background: ${(p) => (p.$hasValue ? '#3ddc84' : 'rgba(255, 255, 255, 0.08)')};
  color: ${(p) => (p.$hasValue ? '#111' : DIM)};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(p) => (p.$hasValue ? 'pointer' : 'default')};
  transition: all 0.2s;

  &:hover {
    ${(p) => p.$hasValue && 'transform: scale(1.05); filter: brightness(1.1);'}
  }

  svg {
    width: 15px;
    height: 15px;
  }
`

export const Disclaimer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 0.68rem;
  color: ${DIM};
  font-family: ui-monospace, monospace;
  letter-spacing: 0.03em;
  padding: 0 4px;

  span:last-child {
    opacity: 0.7;
  }
`
