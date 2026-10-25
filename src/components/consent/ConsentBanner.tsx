import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'
import { setConsent, useConsent } from '@/lib/consent'

const Card = styled(motion.div)`
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 9999;
  width: min(360px, calc(100vw - 32px));
  padding: 1.1rem 1.2rem;
  border-radius: 14px;
  background: rgba(24, 24, 24, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  strong {
    display: block;
    font-weight: 500;
    font-size: 0.95rem;
    margin-bottom: 0.4rem;
  }
  p {
    margin: 0 0 0.9rem;
    font-size: 0.82rem;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.65);
  }
  .row {
    display: flex;
    gap: 0.5rem;
  }
  button {
    flex: 1;
    font: inherit;
    font-size: 0.82rem;
    padding: 0.6rem 0.8rem;
    border-radius: 999px;
    cursor: pointer;
    border: 1px solid rgba(255, 255, 255, 0.25);
    background: transparent;
    color: #fff;
    transition: background 0.2s, color 0.2s;
  }
  button.accept {
    background: #fff;
    color: #000;
    border-color: #fff;
  }
  button:hover {
    background: rgba(255, 255, 255, 0.12);
  }
  button.accept:hover {
    background: #e6e6e6;
  }
`

/** Opt-in prompt: nothing is measured, and no id is stored, until the visitor says yes. */
const ConsentBanner: React.FC = () => {
  const { ready, consent } = useConsent()
  return (
    <AnimatePresence>
      {ready && consent === null && (
        <Card
          role="dialog"
          aria-label="Cookie consent"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0, transition: { duration: 0.2 } }}
          transition={{ type: 'spring', stiffness: 380, damping: 32, delay: 1.2 }}
        >
          <strong>We use cookies</strong>
          <p>
            This site uses cookies and local storage to count visits anonymously: pages
            viewed, time spent and country. No IP address or personal data is stored.
            Declining changes nothing about the site.
          </p>
          <div className="row">
            <button onClick={() => setConsent('denied')}>Decline</button>
            <button className="accept" onClick={() => setConsent('granted')}>
              Accept
            </button>
          </div>
        </Card>
      )}
    </AnimatePresence>
  )
}

export default ConsentBanner
