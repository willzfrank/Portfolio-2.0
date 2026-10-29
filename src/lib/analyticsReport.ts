import {
  Count,
  EventRow,
  Heat,
  IssueRow,
  JourneyStep,
  ProjectStat,
  Report,
  ReturningVisitor,
  SessionRow,
  SessionSummary,
  ViewRow,
} from './analyticsTypes'

const PROJECT_RE = /^\/project\/([^/]+)\/?$/
const BOUNCE_SECONDS = 8
const SLOW_LCP_MS = 2500

export const projectSlug = (path: string | null | undefined): string | null => {
  const m = path ? PROJECT_RE.exec(path) : null
  if (!m) return null
  try {
    return decodeURIComponent(m[1])
  } catch {
    return m[1]
  }
}

/* ---------------- small helpers ---------------- */
const countBy = <T>(items: T[], key: (t: T) => string | null | undefined, limit = 8): Count[] => {
  const m = new Map<string, number>()
  for (const it of items) {
    const k = key(it)
    if (k) m.set(k, (m.get(k) || 0) + 1)
  }
  return Array.from(m, ([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

const median = (xs: number[]) => {
  if (!xs.length) return null
  const s = [...xs].sort((a, b) => a - b)
  return s[Math.floor(s.length / 2)]
}

const regionNames =
  typeof Intl !== 'undefined' && 'DisplayNames' in Intl
    ? new Intl.DisplayNames(['en'], { type: 'region' })
    : null
const countryName = (code: string | null) => {
  if (!code) return null
  try {
    return regionNames?.of(code.toUpperCase()) || code
  } catch {
    return code
  }
}

const SOURCE_RULES: [RegExp, string][] = [
  [/linkedin|lnkd\.in/i, 'LinkedIn'],
  [/github/i, 'GitHub'],
  [/google\./i, 'Google'],
  [/bing\.|duckduckgo|yahoo|ecosia/i, 'Search'],
  [/(^|\.)t\.co$|twitter|(^|\.)x\.com$/i, 'X / Twitter'],
  [/facebook|fb\.com|instagram/i, 'Facebook / Instagram'],
  [/whatsapp|wa\.me/i, 'WhatsApp'],
  [/mail\.google|outlook|mail\./i, 'Email'],
]
export const sourceLabel = (s: Pick<SessionRow, 'utm_source' | 'referrer_host'>): string => {
  const raw = s.utm_source || s.referrer_host
  if (!raw) return 'Direct'
  for (const [re, label] of SOURCE_RULES) if (re.test(raw)) return label
  return raw
}

/** Local hour/weekday for the visitor, so "when do people browse" means *their* day. */
const localParts = (iso: string, tz: string | null) => {
  const d = new Date(iso)
  try {
    const f = new Intl.DateTimeFormat('en-GB', {
      timeZone: tz || 'UTC',
      hour: '2-digit',
      hour12: false,
      weekday: 'short',
    }).formatToParts(d)
    const hour = Number(f.find((p) => p.type === 'hour')?.value ?? 0) % 24
    const wd = f.find((p) => p.type === 'weekday')?.value ?? 'Mon'
    return { hour, weekday: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(wd) }
  } catch {
    return { hour: d.getUTCHours(), weekday: (d.getUTCDay() + 6) % 7 }
  }
}

const ACTION_LABEL: Record<string, string> = {
  resume: 'Downloaded resume',
  email: 'Clicked your email',
  form_start: 'Started the contact form',
  form_submit: 'Sent a message',
  lens: 'Played with the portrait',
}

const INTENT_POINTS: Record<string, number> = {
  resume: 25,
  email: 20,
  form_submit: 25,
  form_start: 10,
  outbound: 10,
  social: 5,
  lens: 3,
}

/* ---------------- the report ---------------- */
export const buildReport = (
  data: { sessions: SessionRow[]; views: ViewRow[]; events: EventRow[] },
  days: number,
  now = new Date(),
  adminTz = 'UTC'
): Report => {
  const { sessions, views, events } = data

  const viewsBySession = new Map<string, ViewRow[]>()
  for (const v of views) {
    if (!v.session_id) continue
    const list = viewsBySession.get(v.session_id) ?? []
    list.push(v)
    viewsBySession.set(v.session_id, list)
  }
  const eventsBySession = new Map<string, EventRow[]>()
  for (const e of events) {
    if (!e.session_id) continue
    const list = eventsBySession.get(e.session_id) ?? []
    list.push(e)
    eventsBySession.set(e.session_id, list)
  }

  /* ----- per session ----- */
  const summaries: SessionSummary[] = sessions.map((s) => {
    const vs = (viewsBySession.get(s.id) ?? []).sort((a, b) => a.created_at.localeCompare(b.created_at))
    const evs = eventsBySession.get(s.id) ?? []
    const journey: JourneyStep[] = vs.map((v) => ({
      path: v.path,
      seconds: Math.round(v.duration_ms / 1000),
      scroll: v.max_scroll,
    }))
    const seconds = journey.reduce((a, j) => a + j.seconds, 0)
    const projects = Array.from(new Set(vs.map((v) => projectSlug(v.path)).filter((x): x is string => !!x)))
    const avgScroll = vs.length ? vs.reduce((a, v) => a + v.max_scroll, 0) / vs.length : 0

    const types = new Set(evs.map((e) => e.type))
    const sawContactPage = vs.some((v) => v.path === '/contact')
    let intent = 0
    for (const t of Array.from(types)) intent += INTENT_POINTS[t] ?? 0
    if (sawContactPage) intent += 8
    intent = Math.min(35, intent)

    const score = Math.round(
      Math.min(30, seconds / 6) +
        Math.min(15, vs.length * 3) +
        Math.min(20, projects.length * 8) +
        Math.min(10, avgScroll * 0.1) +
        intent
    )

    const actions: string[] = []
    for (const t of ['resume', 'email', 'form_submit', 'form_start', 'lens']) {
      if (types.has(t)) actions.push(ACTION_LABEL[t])
    }
    const social = evs.filter((e) => e.type === 'social').map((e) => String(e.meta.host ?? '').replace(/\.com$/, ''))
    for (const h of Array.from(new Set(social))) if (h) actions.push(`Opened your ${h}`)
    if (types.has('outbound')) actions.push('Opened a project link')
    if (sawContactPage && !types.has('form_start')) actions.push('Visited contact page')

    const strongIntent = types.has('resume') || types.has('email') || types.has('form_submit')
    const bounced = vs.length <= 1 && seconds < BOUNCE_SECONDS && !actions.length
    const heat: Heat = bounced ? 'bounced' : strongIntent || score >= 65 ? 'hot' : score >= 35 ? 'warm' : 'casual'

    return {
      id: s.id,
      at: s.started_at,
      country: countryName(s.country),
      city: s.city,
      device: s.device,
      browser: s.browser,
      os: s.os,
      source: sourceLabel(s),
      returning: s.is_returning,
      visitNo: 1,
      pages: vs.length,
      seconds,
      score: Math.max(0, Math.min(100, score)),
      heat,
      journey,
      actions,
      projects,
    }
  })

  /* ----- returning visitors ----- */
  const byVisitor = new Map<string, { row: SessionRow; sum: SessionSummary }[]>()
  sessions.forEach((row, i) => {
    const list = byVisitor.get(row.visitor_id) ?? []
    list.push({ row, sum: summaries[i] })
    byVisitor.set(row.visitor_id, list)
  })
  const returningVisitors: ReturningVisitor[] = []
  byVisitor.forEach((list) => {
    list.sort((a, b) => a.row.started_at.localeCompare(b.row.started_at))
    list.forEach((x, i) => (x.sum.visitNo = i + 1))
    if (list.length < 2 && !list[0].row.is_returning) return
    const last = list[list.length - 1]
    const merged = (pick: (x: SessionSummary) => string[]) => Array.from(new Set(list.flatMap((x) => pick(x.sum))))
    returningVisitors.push({
      id: last.row.id,
      place: [last.sum.city, last.sum.country].filter(Boolean).join(', ') || 'Unknown location',
      device: last.sum.device,
      source: list.find((x) => x.sum.source !== 'Direct')?.sum.source ?? 'Direct',
      visits: list.length,
      firstAt: list[0].row.started_at,
      lastAt: last.row.last_seen_at || last.row.started_at,
      seconds: list.reduce((a, x) => a + x.sum.seconds, 0),
      projects: merged((x) => x.projects),
      actions: merged((x) => x.actions),
    })
  })
  returningVisitors.sort((a, b) => b.lastAt.localeCompare(a.lastAt))

  /* ----- overview ----- */
  const visitors = new Set(sessions.map((s) => s.visitor_id)).size
  const durations = summaries.map((s) => s.seconds)
  const overview = {
    sessions: sessions.length,
    visitors,
    pageViews: views.length,
    avgSeconds: durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0,
    bounceRate: sessions.length ? summaries.filter((s) => s.heat === 'bounced').length / sessions.length : 0,
    returningRate: sessions.length ? sessions.filter((s) => s.is_returning).length / sessions.length : 0,
    hotLeads: summaries.filter((s) => s.heat === 'hot').length,
  }

  /* ----- daily ----- */
  let fmt: Intl.DateTimeFormat
  try {
    fmt = new Intl.DateTimeFormat('en-CA', { timeZone: adminTz, year: 'numeric', month: '2-digit', day: '2-digit' })
  } catch {
    fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit' })
  }
  const dayKey = (iso: string) => fmt.format(new Date(iso))
  const daily: Report['daily'] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = dayKey(new Date(now.getTime() - i * 86400000).toISOString())
    daily.push({ date: d, sessions: 0, views: 0 })
  }
  const dayIdx = new Map(daily.map((d, i) => [d.date, i]))
  for (const s of sessions) {
    const i = dayIdx.get(dayKey(s.started_at))
    if (i !== undefined) daily[i].sessions++
  }
  for (const v of views) {
    const i = dayIdx.get(dayKey(v.created_at))
    if (i !== undefined) daily[i].views++
  }

  /* ----- projects ----- */
  const projAcc = new Map<
    string,
    { views: number; visitors: Set<string>; secs: number; scroll: number; bounces: number }
  >()
  for (const [sid, vs] of Array.from(viewsBySession.entries())) {
    const ordered = [...vs].sort((a, b) => a.created_at.localeCompare(b.created_at))
    ordered.forEach((v, i) => {
      const slug = projectSlug(v.path)
      if (!slug) return
      const acc = projAcc.get(slug) ?? { views: 0, visitors: new Set(), secs: 0, scroll: 0, bounces: 0 }
      acc.views++
      acc.visitors.add(v.visitor_id)
      acc.secs += v.duration_ms / 1000
      acc.scroll += v.max_scroll
      // left the site straight from this page after a few seconds
      if (i === ordered.length - 1 && v.duration_ms / 1000 < BOUNCE_SECONDS) acc.bounces++
      projAcc.set(slug, acc)
    })
    void sid
  }

  const projects: ProjectStat[] = Array.from(projAcc, ([slug, a]) => {
    const evs = events.filter((e) => projectSlug(e.path) === slug)
    const linkClicks = evs.filter((e) => e.type === 'outbound').length
    const errors = evs.filter((e) => e.type === 'js_error' || e.type === 'resource_error').length
    const lcp = median(
      evs.filter((e) => e.type === 'vitals' && Number(e.meta.lcp) > 0 && !e.meta.intro).map((e) => Number(e.meta.lcp))
    )
    const avgSeconds = a.views ? Math.round(a.secs / a.views) : 0
    const avgScroll = a.views ? Math.round(a.scroll / a.views) : 0
    const bounceRate = a.views ? a.bounces / a.views : 0
    // "loved": people stay, read to the end, click through, and many come back to it.
    const loved = Math.round((avgSeconds + avgScroll * 0.5 + linkClicks * 25) * Math.log2(a.views + 1))
    const flags: string[] = []
    if (a.views >= 3 && bounceRate > 0.5) flags.push('Visitors leave quickly')
    if (a.views >= 3 && avgScroll < 30) flags.push('Few read to the end')
    if (lcp && lcp > SLOW_LCP_MS) flags.push(`Slow to load (${(lcp / 1000).toFixed(1)}s)`)
    if (errors) flags.push(`${errors} error${errors > 1 ? 's' : ''} reported`)
    return {
      slug,
      views: a.views,
      visitors: a.visitors.size,
      avgSeconds,
      avgScroll,
      linkClicks,
      bounceRate,
      errors,
      slowLcpMs: lcp,
      loved,
      flags,
    }
  }).sort((a, b) => b.loved - a.loved)
  if (projects[0] && projects[0].views >= 2) projects[0].flags.unshift('Most loved')

  /* ----- audience ----- */
  const sources = countBy(sessions, (s) => sourceLabel(s))
  const byCampaign = new Map<string, SessionSummary[]>()
  sessions.forEach((s, i) => {
    if (!s.utm_source) return
    const list = byCampaign.get(s.utm_source) ?? []
    list.push(summaries[i])
    byCampaign.set(s.utm_source, list)
  })
  const campaigns = Array.from(byCampaign, ([name, list]) => ({
    name,
    visits: list.length,
    avgSeconds: Math.round(list.reduce((a, x) => a + x.seconds, 0) / list.length),
    projectReaders: list.filter((x) => x.projects.length).length,
    resumes: list.filter((x) => x.actions.includes(ACTION_LABEL.resume)).length,
    messages: list.filter((x) => x.actions.includes(ACTION_LABEL.form_submit)).length,
  })).sort((a, b) => b.visits - a.visits)
  const countries = countBy(sessions, (s) => countryName(s.country), 10)
  const cities = countBy(sessions, (s) => (s.city ? `${s.city}${s.country ? `, ${s.country}` : ''}` : null), 10)
  const devices = countBy(sessions, (s) => s.device)
  const browsers = countBy(sessions, (s) => s.browser)
  const systems = countBy(sessions, (s) => s.os)

  const hours = Array(24).fill(0) as number[]
  const weekdays = Array(7).fill(0) as number[]
  for (const s of sessions) {
    const { hour, weekday } = localParts(s.started_at, s.timezone)
    hours[hour]++
    if (weekday >= 0) weekdays[weekday]++
  }

  /* ----- funnel ----- */
  const sessionsWith = (pred: (vs: ViewRow[], evs: EventRow[]) => boolean) =>
    sessions.filter((s) => pred(viewsBySession.get(s.id) ?? [], eventsBySession.get(s.id) ?? [])).length
  const funnel = [
    { label: 'Landed on the site', count: sessions.length },
    { label: 'Looked at the work', count: sessionsWith((vs) => vs.some((v) => v.path.startsWith('/project'))) },
    { label: 'Opened a project', count: sessionsWith((vs) => vs.some((v) => !!projectSlug(v.path))) },
    { label: 'Read About', count: sessionsWith((vs) => vs.some((v) => v.path === '/about')) },
    {
      label: 'Showed hiring intent',
      count: sessionsWith(
        (vs, evs) =>
          vs.some((v) => v.path === '/contact') ||
          evs.some((e) => ['resume', 'email', 'form_start', 'form_submit', 'outbound'].includes(e.type))
      ),
    },
  ]

  const actions = countBy(
    events.filter((e) => e.type in ACTION_LABEL || e.type === 'social' || e.type === 'outbound'),
    (e) =>
      e.type === 'social'
        ? `Opened ${String(e.meta.host ?? 'social profile')}`
        : e.type === 'outbound'
        ? 'Opened a project link'
        : ACTION_LABEL[e.type],
    12
  )

  /* ----- issues ----- */
  const issueMap = new Map<string, IssueRow & { sess: Set<string>; paths: Map<string, number> }>()
  const addIssue = (kind: IssueRow['kind'], key: string, title: string, e: EventRow) => {
    const id = `${kind}|${key}`
    const cur =
      issueMap.get(id) ??
      ({ kind, title, path: e.path || '/', count: 0, sessions: 0, lastSeen: e.created_at, sess: new Set(), paths: new Map() } as IssueRow & {
        sess: Set<string>
        paths: Map<string, number>
      })
    cur.count++
    if (e.session_id) cur.sess.add(e.session_id)
    if (e.created_at > cur.lastSeen) cur.lastSeen = e.created_at
    cur.paths.set(e.path || '/', (cur.paths.get(e.path || '/') || 0) + 1)
    issueMap.set(id, cur)
  }
  for (const e of events) {
    const m = e.meta
    if (e.type === 'js_error') addIssue('js_error', `${m.msg}|${m.src}`, `${m.msg} (${m.src})`, e)
    else if (e.type === 'resource_error') addIssue('resource_error', String(m.url), `Failed to load ${m.tag}: ${m.url}`, e)
    else if (e.type === 'rage_click')
      addIssue('rage_click', `${e.path}|${m.tag}|${m.text}`, `Rapid clicking on ${m.text ? `“${m.text}”` : `a <${m.tag}>`}`, e)
    else if (e.type === 'form_error') addIssue('form_error', 'form', 'Contact form failed to send', e)
    else if (e.type === 'not_found') addIssue('not_found', String(e.path), `Page not found: ${e.path}`, e)
    // A first visit plays the intro animation, which holds the page back by design.
    else if (e.type === 'vitals' && Number(m.lcp) > SLOW_LCP_MS && !m.intro)
      addIssue('slow_page', String(e.path), `Slow first load (LCP ${(Number(m.lcp) / 1000).toFixed(1)}s)`, e)
  }
  const issues: IssueRow[] = Array.from(issueMap.values())
    .map(({ sess, paths, ...rest }) => ({
      ...rest,
      sessions: sess.size,
      path: Array.from(paths.entries()).sort((a, b) => b[1] - a[1])[0][0],
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 30)

  return {
    days,
    generatedAt: now.toISOString(),
    overview,
    daily,
    projects,
    sources,
    campaigns,
    returningVisitors: returningVisitors.slice(0, 20),
    countries,
    cities,
    devices,
    browsers,
    systems,
    hours,
    weekdays,
    funnel,
    actions,
    issues,
    sessions: summaries.sort((a, b) => b.at.localeCompare(a.at)).slice(0, 40),
  }
}
