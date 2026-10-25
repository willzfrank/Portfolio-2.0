import React, { useRef, useState } from 'react'
import { track } from '@/lib/analytics'
import styled from 'styled-components'
import { MINT, DIM, HAIR } from '@/components/home/homeStyles'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 3vw, 2.2rem);

  label {
    position: relative;
    display: block;
  }
  label span {
    display: block;
    font-size: 0.7rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${DIM};
    margin-bottom: 0.4rem;
  }
  input,
  textarea {
    width: 100%;
    padding: 0.7rem 0 0.9rem;
    border: 0;
    border-bottom: 1px solid ${HAIR};
    border-radius: 0;
    background: transparent;
    color: ${MINT};
    font: inherit;
    font-size: clamp(1.1rem, 1.8vw, 1.5rem);
    outline: none;
    resize: vertical;
    transition: border-color 0.4s;
  }
  input:focus,
  textarea:focus {
    border-bottom-color: ${MINT};
  }
  input::placeholder,
  textarea::placeholder {
    color: rgba(231, 250, 236, 0.25);
  }

  button {
    align-self: flex-start;
    padding: 1.1rem 2.2rem;
    border: 0;
    border-radius: 999px;
    background: ${MINT};
    color: #1f1f1f;
    font: inherit;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    cursor: pointer;
    /* no opacity transition here: GSAP fades this in and the two would fight */
    transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  }
  button:hover:not(:disabled) {
    transform: scale(1.05);
  }
  button:disabled {
    opacity: 0.6;
  }
  .note {
    margin: 0;
    font-size: 0.95rem;
    color: rgba(231, 250, 236, 0.85);
  }
  .note.err {
    color: #ff8f8f;
  }
`

const ContactForm: React.FC = () => {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const started = useRef(false)

  // First time a field is focused = they're seriously considering getting in touch.
  const onFocus = () => {
    if (started.current) return
    started.current = true
    track('form_start')
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    setState('sending')
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => null)
    if (res?.ok) {
      form.reset()
      setState('sent')
      track('form_submit')
    } else {
      setState('error')
      track('form_error', { status: res ? res.status : 0 })
    }
  }

  return (
    <Form onSubmit={submit} onFocusCapture={onFocus}>
      <label>
        <span>Your name</span>
        <input name="name" placeholder="Jane Doe" required autoComplete="name" />
      </label>
      <label>
        <span>Your email</span>
        <input
          name="email"
          type="email"
          placeholder="jane@company.com"
          required
          autoComplete="email"
        />
      </label>
      <label>
        <span>Tell me about your project</span>
        <textarea name="message" rows={4} placeholder="What are we building?" required />
      </label>
      <input name="website" tabIndex={-1} autoComplete="off" hidden />
      <button type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : 'Send message'}
      </button>
      {state === 'sent' && <p className="note">Thanks! Your message has been sent.</p>}
      {state === 'error' && (
        <p className="note err">Something went wrong. Please email me directly instead.</p>
      )}
    </Form>
  )
}

export default ContactForm
