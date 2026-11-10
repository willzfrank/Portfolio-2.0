import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence } from 'framer-motion'
import { QUICK_PROMPTS } from '@/lib/aiBio'
import { track } from '@/lib/analytics'
import {
  TriggerPill,
  TriggerDot,
  TriggerSparkle,
  ChatBackdrop,
  ChatDialog,
  ChatHeader,
  HeaderButton,
  ChatBody,
  WelcomeCard,
  ChipsContainer,
  ChipButton,
  MessageRow,
  MessageBubble,
  TypingIndicator,
  ChatFooter,
  InputForm,
  SendButton,
  Disclaimer,
} from './ChatStyles'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const STORAGE_KEY = 'willzfrank_ai_chat_v1'
/** Auto-clear chat after 15 minutes of inactivity */
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000

interface StoredSession {
  messages: Message[]
  lastActive: number
}

/** Helper to format basic markdown, links, and linebreaks inside assistant responses */
const FormattedContent: React.FC<{ content: string }> = ({ content }) => {
  const paragraphs = content.split(/\n\n+/)

  return (
    <>
      {paragraphs.map((p, pIdx) => {
        const lines = p.split('\n')
        const isBulletList = lines.every(
          (l) => l.trim().startsWith('- ') || l.trim().startsWith('* ') || l.trim() === ''
        )

        if (isBulletList && lines.length > 0) {
          return (
            <ul key={pIdx}>
              {lines
                .filter((l) => l.trim())
                .map((line, lIdx) => {
                  const cleaned = line.replace(/^[-*]\s+/, '')
                  return <li key={lIdx}>{renderSpans(cleaned)}</li>
                })}
            </ul>
          )
        }

        return (
          <p key={pIdx}>
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {renderSpans(line)}
                {lIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        )
      })}
    </>
  )
}

function renderSpans(text: string) {
  // Matches markdown links [label](url), bold **bold**, email addresses, or bare URLs
  const parts: React.ReactNode[] = []
  let cursor = 0

  // Regex pattern for markdown links [text](url) or bold **text** or backticks `code` or emails
  const regex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|(https?:\/\/[^\s)]+))/g
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > cursor) {
      parts.push(text.slice(cursor, match.index))
    }

    if (match[2] && match[3]) {
      // Markdown link [text](url)
      const href = match[3]
      const label = match[2]
      parts.push(
        href.startsWith('/') ? (
          <Link key={match.index} href={href}>
            {label}
          </Link>
        ) : (
          <a
            key={match.index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {label}
          </a>
        )
      )
    } else if (match[4]) {
      // Bold **text**
      parts.push(<strong key={match.index}>{match[4]}</strong>)
    } else if (match[5]) {
      // Inline `code`
      parts.push(<code key={match.index}>{match[5]}</code>)
    } else if (match[6]) {
      // Email
      parts.push(
        <a key={match.index} href={`mailto:${match[6]}`}>
          {match[6]}
        </a>
      )
    } else if (match[7]) {
      // URL
      parts.push(
        <a
          key={match.index}
          href={match[7]}
          target="_blank"
          rel="noopener noreferrer"
        >
          {match[7].replace(/^https?:\/\//, '')}
        </a>
      )
    }

    cursor = regex.lastIndex
  }

  if (cursor < text.length) {
    parts.push(text.slice(cursor))
  }

  return parts
}

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Restore previous session from sessionStorage if within inactivity limit
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed: StoredSession = JSON.parse(raw)
        const isExpired =
          !parsed.lastActive ||
          Date.now() - parsed.lastActive > INACTIVITY_TIMEOUT_MS

        if (isExpired) {
          sessionStorage.removeItem(STORAGE_KEY)
          setMessages([])
        } else if (Array.isArray(parsed.messages)) {
          setMessages(parsed.messages)
        }
      }
    } catch {}
  }, [])

  // Check expiration whenever the user re-opens the widget
  useEffect(() => {
    if (isOpen) {
      try {
        const raw = sessionStorage.getItem(STORAGE_KEY)
        if (raw) {
          const parsed: StoredSession = JSON.parse(raw)
          if (
            parsed.lastActive &&
            Date.now() - parsed.lastActive > INACTIVITY_TIMEOUT_MS
          ) {
            sessionStorage.removeItem(STORAGE_KEY)
            setMessages([])
          }
        }
      } catch {}
    }
  }, [isOpen])

  // Save session with timestamp when messages change
  useEffect(() => {
    try {
      if (messages.length > 0) {
        const payload: StoredSession = {
          messages,
          lastActive: Date.now(),
        }
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
      }
    } catch {}
  }, [messages])

  // Scroll to bottom on updates
  useEffect(() => {
    if (isOpen && bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [messages, loading, isOpen])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen])

  // Close on Escape key or click outside
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node
      if (
        dialogRef.current &&
        !dialogRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
    }
  }, [isOpen])

  // Listen for programmatic triggers:
  // 1. window.dispatchEvent(new CustomEvent('open-ai-chat', { detail: { prompt: '...' } }))
  // 2. Clicks on any element with href="#ask-ai" or [data-open-ai-chat]
  // 3. Direct JavaScript call: window.openAiChat?.(prompt)
  useEffect(() => {
    const onOpenCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ prompt?: string }>
      setIsOpen(true)
      track('ai_chat', { action: 'open', trigger: 'custom_event' })
      if (customEvent.detail?.prompt) {
        handleSend(customEvent.detail.prompt)
      }
    }

    const onGlobalClick = (e: MouseEvent) => {
      const target = (e.target as Element)?.closest?.('a[href="#ask-ai"], [data-open-ai-chat]')
      if (target) {
        e.preventDefault()
        setIsOpen(true)
        track('ai_chat', { action: 'open', trigger: 'dom_click' })
        const prompt = target.getAttribute('data-prompt')
        if (prompt) {
          handleSend(prompt)
        }
      }
    }

    if (typeof window !== 'undefined') {
      ;(window as any).openAiChat = (prompt?: string) => {
        setIsOpen(true)
        track('ai_chat', { action: 'open', trigger: 'window_fn' })
        if (prompt) handleSend(prompt)
      }
    }

    window.addEventListener('open-ai-chat', onOpenCustomEvent)
    document.addEventListener('click', onGlobalClick)

    return () => {
      window.removeEventListener('open-ai-chat', onOpenCustomEvent)
      document.removeEventListener('click', onGlobalClick)
      if (typeof window !== 'undefined') {
        delete (window as any).openAiChat
      }
    }
  }, [])

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim()
    if (!text || loading) return

    track('ai_chat', { action: 'send', length: text.length })

    const userMsg: Message = {
      id: String(Date.now()),
      role: 'user',
      content: text,
    }

    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updated.map(({ role, content }) => ({ role, content })),
          path: typeof window !== 'undefined' ? window.location.pathname : '/',
        }),
      })

      const data = await res.json()

      if (res.ok && data.text) {
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            role: 'assistant',
            content: data.text,
          },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            role: 'assistant',
            content:
              data.error ||
              "I'm having a momentary hiccup connecting to Gemini. Please drop Godswill a line directly at willzudoh4@gmail.com!",
          },
        ])
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'assistant',
          content:
            "Network error connecting to the AI assistant. Feel free to reach out directly at willzudoh4@gmail.com.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setMessages([])
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch {}
  }

  return (
    <>
      {/* Floating Trigger Pill */}
      <TriggerPill
        ref={triggerRef}
        onClick={() => {
          setIsOpen((prev) => {
            const next = !prev
            if (next) track('ai_chat', { action: 'open', trigger: 'pill_click' })
            return next
          })
        }}
        aria-label="Ask AI about Godswill"
        whileTap={{ scale: 0.95 }}
      >
        <TriggerDot />
        <TriggerSparkle>
          <svg viewBox="0 0 24 24">
            <path d="M12 2L14.2 8.3L20.5 10.5L14.2 12.7L12 19L9.8 12.7L3.5 10.5L9.8 8.3L12 2Z" />
          </svg>
        </TriggerSparkle>
        <span>Ask AI</span>
      </TriggerPill>

      {/* Floating Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <ChatBackdrop
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <ChatDialog
              ref={dialogRef}
              data-lenis-prevent
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 25, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              role="dialog"
              aria-label="Godswill AI Assistant"
            >
            {/* Header */}
            <ChatHeader>
              <div className="profile">
                <div className="avatar">
                  <Image
                    src="/profile.jpeg"
                    alt="Godswill Francis"
                    width={34}
                    height={34}
                    priority
                  />
                  <span className="status-dot" />
                </div>
                <div className="meta">
                  <span className="name">Godswill&apos;s AI</span>
                  <span className="subtitle">concierge · online</span>
                </div>
              </div>

              <div className="actions">
                {messages.length > 0 && (
                  <HeaderButton
                    onClick={handleReset}
                    title="Clear conversation"
                    aria-label="Clear chat"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </HeaderButton>
                )}
                <HeaderButton
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  aria-label="Close chat"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </HeaderButton>
              </div>
            </ChatHeader>

            {/* Body */}
            <ChatBody
              ref={bodyRef}
              data-lenis-prevent
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              <WelcomeCard>
                <p>
                  Hey! I’m Godswill’s AI concierge. Ask me quick questions about his experience,
                  tech stack, recent mobile/web apps, or availability.
                </p>
                <span className="hint">Or tap a quick question:</span>
                <ChipsContainer>
                  {QUICK_PROMPTS.map((qp) => (
                    <ChipButton
                      key={qp.id}
                      onClick={() => handleSend(qp.prompt)}
                      disabled={loading}
                    >
                      {qp.label}
                    </ChipButton>
                  ))}
                </ChipsContainer>
              </WelcomeCard>

              {messages.map((m) => (
                <MessageRow key={m.id} $isUser={m.role === 'user'}>
                  <MessageBubble $isUser={m.role === 'user'}>
                    <FormattedContent content={m.content} />
                  </MessageBubble>
                </MessageRow>
              ))}

              {loading && (
                <MessageRow $isUser={false}>
                  <TypingIndicator aria-label="Thinking...">
                    <span />
                    <span />
                    <span />
                  </TypingIndicator>
                </MessageRow>
              )}
            </ChatBody>

            {/* Footer Input */}
            <ChatFooter>
              <InputForm
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask a question about Godswill..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                />
                <SendButton
                  type="submit"
                  $hasValue={input.trim().length > 0}
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </SendButton>
              </InputForm>

              <Disclaimer>
                <span>Powered by Gemini</span>
                <span>Grounded in portfolio</span>
              </Disclaimer>
            </ChatFooter>
          </ChatDialog>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChatWidget
