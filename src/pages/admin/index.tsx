import Head from 'next/head'
import React, { useCallback, useEffect, useState } from 'react'
import styled, { keyframes, css } from 'styled-components'
import type { Session } from '@supabase/supabase-js'
import { getBrowserClient } from '@/lib/supabaseClient'
import { markOwnerBrowser } from '@/lib/presence'
import AnalyticsPanel from '@/components/admin/AnalyticsPanel'

/* ---------- types ---------- */
interface Img {
  src: string
  alt: string
  caption?: string
  width: number
  height: number
}
interface Contributor {
  role: string
  name: string
  link?: string
}
interface ProjectRow {
  id?: string
  position: number
  title: string
  slug: string
  type: string
  technologies: string[]
  timeline: string
  description: string
  long_description: string
  live_url: string
  github_url: string | null
  image: string
  category: string
  contributors: Contributor[]
  contributions: string[]
  images: Img[]
  links?: { label: string; url: string }[]
  published: boolean
}
interface Message {
  id: string
  name: string
  email: string
  message: string
  read: boolean
  ref?: string | null
  created_at: string
}

const emptyProject = (): ProjectRow => ({
  position: 0,
  title: '',
  slug: '',
  type: '',
  technologies: [],
  timeline: '',
  description: '',
  long_description: '',
  live_url: '',
  github_url: '',
  image: '',
  category: 'web-design',
  contributors: [],
  contributions: [],
  images: [],
  links: [],
  published: true,
})

/* ---------- api helper ---------- */
const api = async (
  token: string,
  path: string,
  method = 'GET',
  body?: unknown
) => {
  const res = await fetch(`/api/admin/${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (res.status === 204) return null
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Request failed')
  return json
}

const imageSize = (file: File): Promise<{ width: number; height: number }> =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new window.Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
      URL.revokeObjectURL(url)
    }
    img.onerror = () => resolve({ width: 800, height: 600 })
    img.src = url
  })

const uploadImage = async (token: string, file: File) => {
  const { path, token: uploadToken, publicUrl } = await api(
    token,
    'upload',
    'POST',
    { filename: file.name, contentType: file.type, size: file.size }
  )
  const { error } = await getBrowserClient()
    .storage.from('portfolio')
    .uploadToSignedUrl(path, uploadToken, file)
  if (error) throw new Error(error.message)
  return { url: publicUrl as string, ...(await imageSize(file)) }
}

/* ---------- icons (inline SVGs) ---------- */
const IconProjects = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
)
const IconContent = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)
const IconMessages = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)
const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)
const IconLock = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

/* ---------- page ---------- */
export default function Admin() {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const supabase = getBrowserClient()
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session) markOwnerBrowser()
      setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s)
      if (s) markOwnerBrowser()
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  return (
    <Page>
      <Head>
        <title>Admin — Godswill Francis</title>
        <meta name="robots" content="noindex,nofollow" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700&family=Playfair+Display+SC:wght@400;700&display=swap"
        />
      </Head>
      {!ready ? (
        <LoadingScreen>
          <Spinner />
        </LoadingScreen>
      ) : session ? (
        <Dashboard token={session.access_token} email={session.user.email} />
      ) : (
        <Login />
      )}
    </Page>
  )
}

/* ---------- login ---------- */
function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await getBrowserClient().auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <LoginWrapper>
      <LoginCard>
        <LoginBrand>
          <BrandDot style={{ width: 12, height: 12 }} />
          <span>PORTFOLIO CMS</span>
        </LoginBrand>

        <LoginHeading>Welcome back</LoginHeading>
        <LoginSubtitle>Sign in to continue to your dashboard.</LoginSubtitle>

        <LoginForm onSubmit={submit}>
          <InputGroup>
            <InputLabel>Email Address</InputLabel>
            <StyledInput
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </InputGroup>

          <InputGroup>
            <InputLabel>Password</InputLabel>
            <PasswordWrapper>
              <StyledInput
                type={showPassword ? 'text' : 'password'}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{ paddingRight: '3rem' }}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </PasswordToggle>
            </PasswordWrapper>
          </InputGroup>

          {error && <Err>{error}</Err>}

          <LoginButton type="submit" disabled={loading}>
            {loading ? (
              <>
                <SmallSpinner /> Signing in…
              </>
            ) : (
              'Log In'
            )}
          </LoginButton>
        </LoginForm>
      </LoginCard>
    </LoginWrapper>
  )
}

/* ---------- dashboard ---------- */
type Tab = 'analytics' | 'projects' | 'content' | 'messages'

const IconAnalytics = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" />
    <path d="M7 15l4-4 3 3 5-6" />
  </svg>
)

const tabMeta: { key: Tab; label: string; icon: React.FC }[] = [
  { key: 'analytics', label: 'Analytics', icon: IconAnalytics },
  { key: 'projects', label: 'Projects', icon: IconProjects },
  { key: 'content', label: 'Content', icon: IconContent },
  { key: 'messages', label: 'Messages', icon: IconMessages },
]

function Dashboard({ token, email }: { token: string; email?: string }) {
  const [tab, setTab] = useState<Tab>('analytics')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <DashLayout>
      {/* Overlay for mobile */}
      {sidebarOpen && <SidebarOverlay onClick={() => setSidebarOpen(false)} />}

      <Sidebar className={sidebarOpen ? 'open' : ''}>
        <SidebarBrand>
          <BrandDot />
          <span>Portfolio CMS</span>
        </SidebarBrand>

        <SidebarNav>
          {tabMeta.map(({ key, label, icon: Icon }) => (
            <SidebarLink
              key={key}
              className={tab === key ? 'active' : ''}
              onClick={() => {
                setTab(key)
                setSidebarOpen(false)
              }}
            >
              <Icon />
              <span>{label}</span>
            </SidebarLink>
          ))}
        </SidebarNav>

        <SidebarFooter>
          <SidebarEmail>{email}</SidebarEmail>
          <LogoutBtn onClick={() => getBrowserClient().auth.signOut()}>
            <IconLogout />
            <span>Sign out</span>
          </LogoutBtn>
        </SidebarFooter>
      </Sidebar>

      <DashMain>
        <MobileHeader>
          <HamburgerBtn onClick={() => setSidebarOpen(!sidebarOpen)}>
            <span /><span /><span />
          </HamburgerBtn>
          <MobileTitle>{tab}</MobileTitle>
        </MobileHeader>

        <DashContent>
          {tab === 'analytics' && <AnalyticsPanel token={token} />}
          {tab === 'projects' && <Projects token={token} />}
          {tab === 'content' && <Content token={token} />}
          {tab === 'messages' && <Messages token={token} />}
        </DashContent>
      </DashMain>
    </DashLayout>
  )
}

/* ---------- projects ---------- */
function Projects({ token }: { token: string }) {
  const [rows, setRows] = useState<ProjectRow[]>([])
  const [editing, setEditing] = useState<ProjectRow | null>(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      setRows(await api(token, 'projects'))
    } catch (e) {
      setError((e as Error).message)
    }
  }, [token])
  useEffect(() => {
    load()
  }, [load])

  const remove = async (p: ProjectRow) => {
    if (!confirm(`Delete "${p.title}"?`)) return
    await api(token, `projects/${p.id}`, 'DELETE')
    load()
  }

  if (editing)
    return (
      <ProjectForm
        token={token}
        initial={editing}
        onDone={() => {
          setEditing(null)
          load()
        }}
      />
    )

  return (
    <FadeIn>
      <SectionHeader>
        <SectionTitle>Projects</SectionTitle>
        <PrimaryButton onClick={() => setEditing({ ...emptyProject(), position: rows.reduce((m, r) => Math.max(m, r.position), -1) + 1 })}>
          + New project
        </PrimaryButton>
      </SectionHeader>
      {error && <Err>{error}</Err>}
      <ProjectGrid>
        {rows.map((p) => (
          <ProjectCard key={p.id}>
            {p.image && <ProjectThumb src={p.image} alt={p.title} />}
            <ProjectInfo>
              <ProjectName>
                {p.title}
                {!p.published && <DraftBadge>Draft</DraftBadge>}
              </ProjectName>
              <ProjectMeta>/{p.slug} · {p.category}</ProjectMeta>
            </ProjectInfo>
            <ProjectActions>
              <GhostButton onClick={() => setEditing(p)}>Edit</GhostButton>
              <DangerButton onClick={() => remove(p)}>Delete</DangerButton>
            </ProjectActions>
          </ProjectCard>
        ))}
      </ProjectGrid>
      {rows.length === 0 && !error && (
        <EmptyState>
          <p>No projects yet.</p>
          <small>The public site shows built-in static projects until you add one.</small>
        </EmptyState>
      )}
    </FadeIn>
  )
}

const contributorsToText = (c: Contributor[]) =>
  c.map((x) => [x.role, x.name, x.link ?? ''].join(' | ')).join('\n')
const textToContributors = (t: string): Contributor[] =>
  t
    .split('\n')
    .map((l) => l.split('|').map((s) => s.trim()))
    .filter((p) => p[0] && p[1])
    .map(([role, name, link]) => ({ role, name, ...(link ? { link } : {}) }))

function ProjectForm({
  token,
  initial,
  onDone,
}: {
  token: string
  initial: ProjectRow
  onDone: () => void
}) {
  const [p, setP] = useState<ProjectRow>(initial)
  const [techText, setTechText] = useState(initial.technologies.join(', '))
  const [linksText, setLinksText] = useState((initial.links ?? []).map((l) => `${l.label} | ${l.url}`).join('\n'))
  const [contribText, setContribText] = useState(
    initial.contributions.join('\n')
  )
  const [peopleText, setPeopleText] = useState(
    contributorsToText(initial.contributors)
  )
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const set = <K extends keyof ProjectRow>(k: K, v: ProjectRow[K]) =>
    setP((prev) => ({ ...prev, [k]: v }))

  const onCover = async (file?: File) => {
    if (!file) return
    setBusy(true)
    try {
      set('image', (await uploadImage(token, file)).url)
    } catch (e) {
      setError((e as Error).message)
    }
    setBusy(false)
  }

  const onGallery = async (files: FileList | null) => {
    if (!files) return
    setBusy(true)
    try {
      const added: Img[] = []
      for (const f of Array.from(files)) {
        const u = await uploadImage(token, f)
        added.push({ src: u.url, alt: p.title, width: u.width, height: u.height })
      }
      setP((prev) => ({ ...prev, images: [...prev.images, ...added] }))
    } catch (e) {
      setError((e as Error).message)
    }
    setBusy(false)
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const body = {
      ...p,
      slug: p.slug || p.title,
      technologies: techText.split(','),
      contributions: contribText.split('\n'),
      contributors: textToContributors(peopleText),
    }
    try {
      if (p.id) await api(token, `projects/${p.id}`, 'PUT', body)
      else await api(token, 'projects', 'POST', body)
      onDone()
    } catch (e) {
      setError((e as Error).message)
      setBusy(false)
    }
  }

  return (
    <FadeIn>
      <FormCard as="form" onSubmit={save}>
        <SectionHeader>
          <SectionTitle>{p.id ? 'Edit project' : 'New project'}</SectionTitle>
          <GhostButton type="button" onClick={onDone}>← Back</GhostButton>
        </SectionHeader>

        <FormGrid>
          <InputGroup>
            <InputLabel>Title</InputLabel>
            <StyledInput required value={p.title} onChange={(e) => set('title', e.target.value)} />
          </InputGroup>
          <InputGroup>
            <InputLabel>Slug (URL)</InputLabel>
            <StyledInput value={p.slug} placeholder="auto from title" onChange={(e) => set('slug', e.target.value)} />
          </InputGroup>
          <InputGroup>
            <InputLabel>Type</InputLabel>
            <StyledInput value={p.type} onChange={(e) => set('type', e.target.value)} />
          </InputGroup>
          <InputGroup>
            <InputLabel>Category</InputLabel>
            <StyledSelect value={p.category} onChange={(e) => set('category', e.target.value)}>
              {['web-design', 'ai', 'hr', 'ecommerce', 'tech'].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </StyledSelect>
          </InputGroup>
          <InputGroup>
            <InputLabel>Timeline</InputLabel>
            <StyledInput value={p.timeline} onChange={(e) => set('timeline', e.target.value)} />
          </InputGroup>
          <InputGroup>
            <InputLabel>Order (lower first; the first 4 published show on the home page)</InputLabel>
            <StyledInput type="number" value={p.position} onChange={(e) => set('position', Number(e.target.value))} />
          </InputGroup>
        </FormGrid>

        <InputGroup>
          <InputLabel>Short description</InputLabel>
          <StyledTextarea rows={2} value={p.description} onChange={(e) => set('description', e.target.value)} />
        </InputGroup>
        <InputGroup>
          <InputLabel>Long description</InputLabel>
          <StyledTextarea rows={6} value={p.long_description} onChange={(e) => set('long_description', e.target.value)} />
        </InputGroup>

        <FormGrid>
          <InputGroup>
            <InputLabel>Live URL</InputLabel>
            <StyledInput value={p.live_url} onChange={(e) => set('live_url', e.target.value)} />
          </InputGroup>
          <InputGroup>
            <InputLabel>GitHub URL</InputLabel>
            <StyledInput value={p.github_url ?? ''} onChange={(e) => set('github_url', e.target.value)} />
          </InputGroup>
        </FormGrid>

        <InputGroup>
          <InputLabel>Store links (one per line: Label | URL, e.g. Google Play | https://play.google.com/...)</InputLabel>
          <StyledTextarea
            rows={3}
            value={linksText}
            onChange={(e) => {
              setLinksText(e.target.value)
              set(
                'links',
                e.target.value
                  .split('\n')
                  .map((l) => l.split('|').map((x) => x.trim()))
                  .filter((p) => p.length >= 2 && p[0] && p[1])
                  .map((p) => ({ label: p[0], url: p.slice(1).join('|') }))
              )
            }}
          />
        </InputGroup>

        <InputGroup>
          <InputLabel>Technologies (comma separated)</InputLabel>
          <StyledInput value={techText} onChange={(e) => setTechText(e.target.value)} />
        </InputGroup>
        <InputGroup>
          <InputLabel>Contributions (one per line)</InputLabel>
          <StyledTextarea rows={4} value={contribText} onChange={(e) => setContribText(e.target.value)} />
        </InputGroup>
        <InputGroup>
          <InputLabel>Contributors (one per line: Role | Name | link)</InputLabel>
          <StyledTextarea rows={3} value={peopleText} onChange={(e) => setPeopleText(e.target.value)} />
        </InputGroup>

        <FormGrid>
          <InputGroup>
            <InputLabel>Cover image</InputLabel>
            <FileInput type="file" accept="image/*" onChange={(e) => onCover(e.target.files?.[0])} />
            {p.image && <CoverPreview src={p.image} alt="" />}
          </InputGroup>
          <InputGroup>
            <InputLabel>Gallery images</InputLabel>
            <FileInput type="file" accept="image/*" multiple onChange={(e) => onGallery(e.target.files)} />
          </InputGroup>
        </FormGrid>

        {p.images.length > 0 && (
          <GalleryGrid>
            {p.images.map((img, i) => (
              <GalleryItem key={img.src}>
                <GalleryThumb src={img.src} alt="" />
                <DangerButton
                  type="button"
                  onClick={() => set('images', p.images.filter((_, j) => j !== i))}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                >
                  Remove
                </DangerButton>
              </GalleryItem>
            ))}
          </GalleryGrid>
        )}

        <CheckboxRow>
          <input type="checkbox" id="published" checked={p.published} onChange={(e) => set('published', e.target.checked)} />
          <label htmlFor="published">Published</label>
        </CheckboxRow>

        {error && <Err>{error}</Err>}
        <PrimaryButton type="submit" disabled={busy} style={{ alignSelf: 'flex-start' }}>
          {busy ? 'Saving…' : 'Save project'}
        </PrimaryButton>
      </FormCard>
    </FadeIn>
  )
}

/* ---------- site content ---------- */
function Content({ token }: { token: string }) {
  const [about, setAbout] = useState('')
  const [status, setStatus] = useState('')
  const [resumeUrl, setResumeUrl] = useState('')
  const [resumeStatus, setResumeStatus] = useState('')

  useEffect(() => {
    api(token, 'content').then(
      (rows: { key: string; value: { text?: string; url?: string } }[]) => {
        setAbout(rows.find((r) => r.key === 'about')?.value.text ?? '')
        setResumeUrl(rows.find((r) => r.key === 'resume')?.value.url ?? '')
      }
    )
  }, [token])

  const uploadResume = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setResumeStatus('Please choose a PDF.')
      return
    }
    setResumeStatus('Uploading…')
    try {
      const { url } = await uploadImage(token, file)
      await api(token, 'content', 'PUT', { key: 'resume', value: { url } })
      setResumeUrl(url)
      setResumeStatus('✓ Resume updated. The site uses it within a minute.')
    } catch (err) {
      setResumeStatus((err as Error).message)
    }
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api(token, 'content', 'PUT', { key: 'about', value: { text: about } })
      setStatus('✓ Saved. The site updates within a minute.')
    } catch (err) {
      setStatus((err as Error).message)
    }
  }

  return (
    <FadeIn>
      <FormCard as="form" onSubmit={save}>
        <SectionTitle>About text (home page)</SectionTitle>
        <InputGroup>
          <StyledTextarea rows={10} value={about} onChange={(e) => setAbout(e.target.value)} />
        </InputGroup>
        <PrimaryButton type="submit" style={{ alignSelf: 'flex-start' }}>Save</PrimaryButton>
        {status && <StatusText>{status}</StatusText>}
      </FormCard>
      <FormCard style={{ marginTop: '1.5rem' }}>
        <SectionTitle>Resume (PDF)</SectionTitle>
        <StatusText>
          {resumeUrl ? (
            <>
              Current:{' '}
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                view uploaded resume
              </a>
            </>
          ) : (
            'Using the default resume bundled with the site.'
          )}
        </StatusText>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) uploadResume(f)
            e.target.value = ''
          }}
        />
        {resumeStatus && <StatusText>{resumeStatus}</StatusText>}
      </FormCard>
    </FadeIn>
  )
}

/* ---------- messages ---------- */
function Messages({ token }: { token: string }) {
  const [rows, setRows] = useState<Message[]>([])
  const load = useCallback(async () => setRows(await api(token, 'messages')), [token])
  useEffect(() => {
    load()
  }, [load])

  return (
    <FadeIn>
      <SectionTitle>Messages</SectionTitle>
      {rows.length === 0 && (
        <EmptyState>
          <p>No messages yet.</p>
        </EmptyState>
      )}
      <MessagesGrid>
        {rows.map((m) => (
          <MessageCard key={m.id} className={m.read ? 'read' : ''}>
            <MessageHeader>
              <MessageSender>{m.name}</MessageSender>
              <MessageDate>{new Date(m.created_at).toLocaleString()}</MessageDate>
            </MessageHeader>
            <MessageEmail href={`mailto:${m.email}`}>{m.email}</MessageEmail>
            {m.ref && <MessageDate>via tracked link: {m.ref}</MessageDate>}
            <MessageBody>{m.message}</MessageBody>
            <MessageActions>
              <GhostButton
                onClick={async () => {
                  await api(token, `messages?id=${m.id}`, 'PATCH', { read: !m.read })
                  load()
                }}
              >
                {m.read ? '○ Mark unread' : '● Mark read'}
              </GhostButton>
              <DangerButton
                onClick={async () => {
                  await api(token, `messages?id=${m.id}`, 'DELETE')
                  load()
                }}
              >
                Delete
              </DangerButton>
            </MessageActions>
          </MessageCard>
        ))}
      </MessagesGrid>
    </FadeIn>
  )
}

/* =================================================================
   STYLED COMPONENTS — Premium dark theme matching portfolio
   ================================================================= */

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`

const spin = keyframes`
  to { transform: rotate(360deg); }
`

const FadeIn = styled.div`
  animation: ${fadeIn} 0.4s ease-out;
`

/* ---------- page wrapper ---------- */
const Page = styled.div`
  min-height: 100vh;
  background: #1a1a1a;
  color: rgb(231, 250, 236);
  font-family: 'League Spartan', sans-serif;
  cursor: auto;
  * { cursor: auto; }
  button, a { cursor: pointer; }
`

const LoadingScreen = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(231, 250, 236, 0.15);
  border-top-color: rgb(231, 250, 236);
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`

/* ---------- login ---------- */
const LoginWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background:
    radial-gradient(ellipse at 30% 40%, rgba(231, 250, 236, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 60%, rgba(231, 250, 236, 0.03) 0%, transparent 50%),
    #1a1a1a;
`

const LoginCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 460px;
  padding: 2.5rem 2.5rem 3rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(231, 250, 236, 0.08);
  border-radius: 24px;
  backdrop-filter: blur(20px);
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 500px) {
    padding: 2rem 1.5rem 2.5rem;
    border-radius: 18px;
  }
`

const LoginBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: 'League Spartan', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: rgba(231, 250, 236, 0.45);
  margin-bottom: 2rem;
`

const LoginHeading = styled.h1`
  font-family: 'Playfair Display SC', serif;
  font-size: 2.2rem;
  font-weight: 400;
  color: rgb(231, 250, 236);
  margin-bottom: 0.4rem;
  text-align: center;

  @media (max-width: 500px) {
    font-size: 1.8rem;
  }
`

const LoginSubtitle = styled.p`
  font-size: 0.95rem;
  color: rgba(231, 250, 236, 0.45);
  margin-bottom: 2.25rem;
  text-align: center;
`

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  width: 100%;
`

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem;
  background: none;
  border: none;
  color: rgba(231, 250, 236, 0.35);
  transition: color 0.2s;
  &:hover {
    color: rgba(231, 250, 236, 0.7);
  }
`

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.85rem;
  border: none;
  border-radius: 12px;
  background: rgb(231, 250, 236);
  color: #1a1a1a;
  font-family: 'League Spartan', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  margin-top: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: #fff;
    box-shadow: 0 6px 24px rgba(231, 250, 236, 0.15);
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
  &:disabled {
    opacity: 0.6;
    pointer-events: none;
  }
`

const smallSpin = keyframes`
  to { transform: rotate(360deg); }
`

const SmallSpinner = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(26, 26, 26, 0.2);
  border-top-color: #1a1a1a;
  border-radius: 50%;
  animation: ${smallSpin} 0.6s linear infinite;
`


/* ---------- sidebar layout ---------- */
const DashLayout = styled.div`
  display: flex;
  min-height: 100vh;
`

const SidebarOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 98;
  @media (min-width: 769px) { display: none; }
`

const Sidebar = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 260px;
  background: #1f1f1f;
  border-right: 1px solid rgba(231, 250, 236, 0.08);
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
  z-index: 99;
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    transform: translateX(-100%);
    &.open { transform: translateX(0); }
  }
`

const SidebarBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1.5rem 1.5rem;
  border-bottom: 1px solid rgba(231, 250, 236, 0.08);
  font-family: 'Playfair Display SC', serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: rgb(231, 250, 236);
`

const BrandDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgb(231, 250, 236);
  box-shadow: 0 0 10px rgba(231, 250, 236, 0.5);
`

const SidebarNav = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem 0.75rem;
`

const SidebarLink = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: rgba(231, 250, 236, 0.5);
  font-family: 'League Spartan', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 10px;
  text-align: left;
  transition: all 0.2s;

  &:hover {
    background: rgba(231, 250, 236, 0.05);
    color: rgb(231, 250, 236);
  }

  &.active {
    background: rgba(231, 250, 236, 0.08);
    color: rgb(231, 250, 236);
    font-weight: 600;
    box-shadow: inset 3px 0 0 rgb(231, 250, 236);
  }
`

const SidebarFooter = styled.div`
  padding: 1rem 1.5rem 0;
  border-top: 1px solid rgba(231, 250, 236, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const SidebarEmail = styled.small`
  font-size: 0.8rem;
  color: rgba(231, 250, 236, 0.4);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0;
  background: none;
  border: none;
  color: rgba(231, 250, 236, 0.5);
  font-family: 'League Spartan', sans-serif;
  font-size: 0.9rem;
  transition: color 0.2s;
  &:hover { color: #ff6b6b; }
`

/* ---------- main content area ---------- */
const DashMain = styled.div`
  flex: 1;
  margin-left: 260px;
  min-height: 100vh;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`

const MobileHeader = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background: #1f1f1f;
    border-bottom: 1px solid rgba(231, 250, 236, 0.08);
  }
`

const HamburgerBtn = styled.button`
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  padding: 4px;
  span {
    display: block;
    width: 22px;
    height: 2px;
    background: rgb(231, 250, 236);
    border-radius: 2px;
  }
`

const MobileTitle = styled.span`
  font-family: 'Playfair Display SC', serif;
  font-size: 1.1rem;
  text-transform: capitalize;
  color: rgb(231, 250, 236);
`

const DashContent = styled.main`
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`

/* ---------- section header ---------- */
const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

const SectionTitle = styled.h2`
  font-family: 'Playfair Display SC', serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: rgb(231, 250, 236);
`

/* ---------- buttons ---------- */
const PrimaryButton = styled.button`
  padding: 0.65rem 1.4rem;
  border: none;
  border-radius: 10px;
  background: rgb(231, 250, 236);
  color: #1a1a1a;
  font-family: 'League Spartan', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s;
  &:hover {
    background: #fff;
    box-shadow: 0 4px 20px rgba(231, 250, 236, 0.2);
    transform: translateY(-1px);
  }
  &:active { transform: translateY(0); }
  &:disabled { opacity: 0.5; pointer-events: none; }
`

const GhostButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid rgba(231, 250, 236, 0.15);
  border-radius: 8px;
  background: transparent;
  color: rgb(231, 250, 236);
  font-family: 'League Spartan', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s;
  &:hover {
    background: rgba(231, 250, 236, 0.06);
    border-color: rgba(231, 250, 236, 0.3);
  }
`

const DangerButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 8px;
  background: rgba(255, 107, 107, 0.08);
  color: #ff6b6b;
  font-family: 'League Spartan', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s;
  &:hover {
    background: rgba(255, 107, 107, 0.15);
    border-color: rgba(255, 107, 107, 0.5);
  }
`

/* ---------- form elements ---------- */
const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`

const InputLabel = styled.label`
  font-size: 0.82rem;
  font-weight: 600;
  color: rgba(231, 250, 236, 0.6);
  letter-spacing: 0.03em;
  text-transform: uppercase;
`

const inputStyles = css`
  font-family: 'League Spartan', sans-serif;
  font-size: 0.95rem;
  font-weight: 400;
  padding: 0.7rem 1rem;
  border: 1px solid rgba(231, 250, 236, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  color: rgb(231, 250, 236);
  transition: all 0.2s;
  outline: none;

  &::placeholder {
    color: rgba(231, 250, 236, 0.25);
  }

  &:focus {
    border-color: rgba(231, 250, 236, 0.3);
    background: rgba(255, 255, 255, 0.06);
    box-shadow: 0 0 0 3px rgba(231, 250, 236, 0.05);
  }
`

const StyledInput = styled.input`
  ${inputStyles}
`

const StyledTextarea = styled.textarea`
  ${inputStyles}
  resize: vertical;
`

const StyledSelect = styled.select`
  ${inputStyles}
  option {
    background: #222;
    color: rgb(231, 250, 236);
  }
`

const FileInput = styled.input`
  ${inputStyles}
  padding: 0.5rem;
  &::file-selector-button {
    font-family: 'League Spartan', sans-serif;
    padding: 0.4rem 0.8rem;
    border: 1px solid rgba(231, 250, 236, 0.15);
    border-radius: 6px;
    background: rgba(231, 250, 236, 0.08);
    color: rgb(231, 250, 236);
    cursor: pointer;
    margin-right: 0.75rem;
    transition: background 0.2s;
  }
  &::file-selector-button:hover {
    background: rgba(231, 250, 236, 0.15);
  }
`

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: rgb(231, 250, 236);
  }
  label {
    font-size: 0.95rem;
    color: rgb(231, 250, 236);
    cursor: pointer;
  }
`

/* ---------- error / status ---------- */
const Err = styled.p`
  color: #ff6b6b;
  font-size: 0.9rem;
  padding: 0.6rem 1rem;
  background: rgba(255, 107, 107, 0.08);
  border: 1px solid rgba(255, 107, 107, 0.2);
  border-radius: 8px;
`

const StatusText = styled.small`
  color: rgba(231, 250, 236, 0.6);
  font-size: 0.85rem;
`

/* ---------- project list ---------- */
const ProjectGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const ProjectCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(231, 250, 236, 0.08);
  border-radius: 14px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(231, 250, 236, 0.15);
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const ProjectThumb = styled.img`
  width: 80px;
  height: 56px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid rgba(231, 250, 236, 0.1);
  flex-shrink: 0;
`

const ProjectInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const ProjectName = styled.div`
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgb(231, 250, 236);
`

const DraftBadge = styled.span`
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  border-radius: 20px;
  background: rgba(255, 193, 7, 0.15);
  color: #ffc107;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const ProjectMeta = styled.small`
  color: rgba(231, 250, 236, 0.4);
  font-size: 0.82rem;
`

const ProjectActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
`

/* ---------- form card ---------- */
const FormCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(231, 250, 236, 0.08);
  border-radius: 16px;

  @media (max-width: 600px) {
    padding: 1.25rem;
  }
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

const CoverPreview = styled.img`
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid rgba(231, 250, 236, 0.1);
  margin-top: 0.5rem;
`

const GalleryGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`

const GalleryItem = styled.figure`
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`

const GalleryThumb = styled.img`
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid rgba(231, 250, 236, 0.1);
`

/* ---------- empty state ---------- */
const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(231, 250, 236, 0.4);
  p { font-size: 1.1rem; margin-bottom: 0.5rem; }
  small { font-size: 0.85rem; }
`

/* ---------- messages ---------- */
const MessagesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const MessageCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(231, 250, 236, 0.08);
  border-radius: 14px;
  transition: all 0.2s;

  &.read { opacity: 0.55; }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(231, 250, 236, 0.15);
    opacity: 1;
  }
`

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`

const MessageSender = styled.strong`
  font-size: 1rem;
  color: rgb(231, 250, 236);
`

const MessageDate = styled.small`
  color: rgba(231, 250, 236, 0.35);
  font-size: 0.8rem;
`

const MessageEmail = styled.a`
  color: rgba(231, 250, 236, 0.5);
  font-size: 0.85rem;
  text-decoration: none;
  &:hover { color: rgb(231, 250, 236); text-decoration: underline; }
`

const MessageBody = styled.p`
  white-space: pre-wrap;
  font-size: 0.95rem;
  color: rgba(231, 250, 236, 0.75);
  line-height: 1.6;
`

const MessageActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
`





