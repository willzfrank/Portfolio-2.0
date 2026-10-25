import { useEffect, useState } from 'react'

const CONSENT_KEY = 'pf_consent'
const CONSENT_EVENT = 'pf:consent'

export type Consent = 'granted' | 'denied' | null

export const getConsent = (): Consent => {
  try {
    const v = localStorage.getItem(CONSENT_KEY)
    return v === 'granted' || v === 'denied' ? v : null
  } catch {
    return null
  }
}

/** Declining wipes every identifier we may have stored earlier. */
export const setConsent = (value: 'granted' | 'denied') => {
  try {
    localStorage.setItem(CONSENT_KEY, value)
    if (value === 'denied') {
      localStorage.removeItem('pf_visitor_id')
      localStorage.removeItem('pf_seen')
      sessionStorage.removeItem('pf_sid')
      sessionStorage.removeItem('pf_sid_ts')
    }
  } catch {}
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }))
}

/** Reactive consent state; `ready` is false until the stored choice has been read. */
export const useConsent = () => {
  const [state, setState] = useState<{ ready: boolean; consent: Consent }>({
    ready: false,
    consent: null,
  })
  useEffect(() => {
    const read = () => setState({ ready: true, consent: getConsent() })
    read()
    window.addEventListener(CONSENT_EVENT, read)
    window.addEventListener('storage', read)
    return () => {
      window.removeEventListener(CONSENT_EVENT, read)
      window.removeEventListener('storage', read)
    }
  }, [])
  return state
}
