import React, { useState } from 'react'

const field: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem',
  marginBottom: '0.75rem',
  border: '1px solid rgb(50, 50, 50)',
  background: 'transparent',
  font: 'inherit',
}

const ContactForm: React.FC = () => {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle'
  )

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
    } else setState('error')
  }

  return (
    <form onSubmit={submit} style={{ marginTop: '2rem', maxWidth: 520 }}>
      <input name="name" placeholder="Your name" required style={field} />
      <input
        name="email"
        type="email"
        placeholder="Your email"
        required
        style={field}
      />
      <textarea
        name="message"
        placeholder="Your message"
        rows={5}
        required
        style={field}
      />
      <input name="website" tabIndex={-1} autoComplete="off" hidden />
      <button type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'SENDING…' : 'SEND MESSAGE'}
      </button>
      {state === 'sent' && <p>Thanks! Your message has been sent.</p>}
      {state === 'error' && (
        <p>Something went wrong. Please email me directly instead.</p>
      )}
    </form>
  )
}

export default ContactForm
