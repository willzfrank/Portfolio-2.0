import type { NextApiRequest, NextApiResponse } from 'next'
import { AI_SYSTEM_PROMPT } from '@/lib/aiBio'
import { rateLimited } from '@/lib/rateLimit'
import { getServerClient } from '@/lib/supabaseAdmin'
import { notifyAiLead } from '@/lib/notify'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface RequestBody {
  messages: ChatMessage[]
  path?: string
}

interface ApiResponse {
  text?: string
  error?: string
}

const MODELS_TO_TRY = [
  process.env.GEMINI_MODEL,
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.8-flash',
  'gemini-flash-latest',
].filter(Boolean) as string[]

const getFallbackResponse = (query: string): string => {
  const q = query.toLowerCase()
  if (q.includes('stack') || q.includes('skill') || q.includes('technolog')) {
    return (
      "I'm a Senior Software Engineer specializing in both frontend and backend. " +
      'My primary stack includes React, Next.js, TypeScript, React Native & Flutter for mobile, ' +
      'and Node.js, Go, Python, and Java (Spring Boot) on the backend with PostgreSQL, Redis, Docker, and AWS.'
    )
  }
  if (q.includes('availab') || q.includes('hire') || q.includes('freelance') || q.includes('job') || q.includes('role')) {
    return (
      'Yes! I am actively available for freelance projects, contract roles, and full-time senior remote opportunities. ' +
      'Feel free to reach out directly via email at willzudoh4@gmail.com or through the /contact page!'
    )
  }
  if (q.includes('sterling') || q.includes('polar') || q.includes('experience') || q.includes('work')) {
    return (
      "I bring 5+ years of software engineering experience. Currently, I'm a Senior Software Engineer at Polar Frequency and Santoms. " +
      'Previously, I built core banking transactions and secure flows at Sterling Bank, and engineered web/mobile platforms with Ullweb, Yetti, and Vsonet.'
    )
  }
  if (q.includes('project') || q.includes('cafe') || q.includes('app')) {
    return (
      'Some of my recent work includes Café One (the mobile booking app for Nigeria’s largest coworking network, live on Google Play & iOS), ' +
      'Whipcare (on-demand auto service platform), and Bucks Invest (fintech wealth management platform). Check out the /project page for full case studies!'
    )
  }
  return (
    'I am Godswill Francis (Willz Frank), a Senior Software Engineer based in Lagos, Nigeria. ' +
    'You can email me at willzudoh4@gmail.com, grab my resume at /api/resume, or send a note on the /contact page.'
  )
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Rate limit: 20 calls per minute per IP
  if (rateLimited(req, 'ai-chat', 20, 60_000)) {
    return res.status(429).json({ error: 'Too many requests. Please take a breath and try again shortly.' })
  }

  const { messages } = req.body as RequestBody

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Invalid messages array' })
  }

  const lastMessage = messages[messages.length - 1]
  if (!lastMessage || !lastMessage.content || typeof lastMessage.content !== 'string') {
    return res.status(400).json({ error: 'Message content is required' })
  }

  const userQuery = lastMessage.content.trim().slice(0, 800)
  const reqPath = (req.body?.path as string) || '/'
  const apiKey = process.env.GEMINI_API_KEY?.trim()

  // Detect hiring leads or shared contacts in visitor question
  const emailMatch = userQuery.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/)
  const visitorEmail = emailMatch ? emailMatch[1] : null
  const hasHiringIntent =
    /\b(hire|hiring|contract|freelance|rate|rates|budget|quote|interview|offer|project scope|talk to godswill|work with you|collaborat)\b/i.test(
      userQuery
    )
  const isLead = Boolean(visitorEmail || hasHiringIntent)

  const logInteraction = async (answer: string) => {
    try {
      const db = getServerClient()
      const country = (req.headers['x-vercel-ip-country'] as string) || null
      const ua = (req.headers['user-agent'] as string) || null

      // 1. Record in Supabase (non-blocking)
      await db.from('ai_chat_logs').insert({
        question: userQuery,
        answer,
        is_lead: isLead,
        visitor_email: visitorEmail,
        path: reqPath,
        ip_country: country,
        user_agent: ua ? ua.slice(0, 200) : null,
      })

      // 2. Alert admin via Resend if high intent
      if (isLead) {
        await notifyAiLead({
          question: userQuery,
          answer,
          visitorEmail,
          isExplicitLead: true,
          path: reqPath,
          country,
          device: ua ? ua.slice(0, 100) : null,
        })
      }
    } catch {
      // Never let logging errors fail the visitor request
    }
  }

  if (!apiKey) {
    // If user hasn't added the key yet, gracefully return a helpful response with knowledge fallback
    const fallback = getFallbackResponse(userQuery)
    await logInteraction(fallback)
    return res.status(200).json({
      text: `${fallback}\n\n*(Note: Add GEMINI_API_KEY to your .env.local to activate real-time Gemini generation.)*`,
    })
  }

  // Convert chat history to Gemini's expected contents structure
  // Gemini requires: alternating roles 'user' and 'model'
  const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = []

  // Take the last 6 messages for context to keep latency ultra-low
  const contextHistory = messages.slice(-6)

  for (const msg of contextHistory) {
    const role = msg.role === 'assistant' ? 'model' : 'user'
    const text = (msg.content || '').trim().slice(0, 1000)
    if (!text) continue

    const prev = contents[contents.length - 1]
    if (prev && prev.role === role) {
      // Merge consecutive same-role messages
      prev.parts[0].text += `\n\n${text}`
    } else {
      contents.push({
        role,
        parts: [{ text }],
      })
    }
  }

  // Ensure history starts with a user message
  if (contents.length > 0 && contents[0].role !== 'user') {
    contents.shift()
  }

  // If contents became empty, put the current user query
  if (contents.length === 0) {
    contents.push({
      role: 'user',
      parts: [{ text: userQuery }],
    })
  }

  // Try configured / available Gemini models in sequence
  let lastError: any = null

  for (const model of MODELS_TO_TRY) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: AI_SYSTEM_PROMPT }],
          },
          contents,
          generationConfig: {
            temperature: 0.6,
            topP: 0.9,
            maxOutputTokens: 600,
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        lastError = errorData?.error?.message || `HTTP ${response.status} from ${model}`
        // If 404 (model not found), try the next model
        if (response.status === 404) {
          continue
        }
        // If quota or auth error, throw
        throw new Error(lastError)
      }

      const data = await response.json()
      const parts = data?.candidates?.[0]?.content?.parts || []
      // Collect and join all text parts (ignoring thinking parts)
      const candidateText = parts
        .filter((p: any) => p.text && !p.thought)
        .map((p: any) => p.text)
        .join('')
        .trim()

      if (candidateText) {
        await logInteraction(candidateText)
        return res.status(200).json({ text: candidateText })
      }
    } catch (err: any) {
      lastError = err?.message || err
      // If network failure or explicit abort, continue to next model candidate
    }
  }

  // If all models failed or threw
  console.error('Gemini API Error:', lastError)
  const fallback = getFallbackResponse(userQuery)
  await logInteraction(fallback)
  return res.status(200).json({
    text: fallback,
  })
}

