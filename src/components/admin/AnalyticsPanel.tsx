import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { openPresence, PresencePerson } from '@/lib/presence'
import type { Report, SessionSummary, ProjectStat, Count, IssueRow, Heat } from '@/lib/analyticsTypes'

const MINT = 'rgb(231, 250, 236)'
const DIM = 'rgba(231, 250, 236, 0.55)'
const LINE = 'rgba(231, 250, 236, 0.1)'
const CARD = 'rgba(255, 255, 255, 0.03)'

type Tab = 'overview' | 'projects' | 'visitors' | 'audience' | 'issues'
const TABS: { key: Tab; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'projects', label: 'Projects' },
  { key: 'visitors', label: 'Visitors' },
  { key: 'audience', label: 'Audience' },
  { key: 'issues', label: 'Issues' },
]
const RANGES = [
  { days: 1, label: '24h' },
  { days: 7, label: '7 days' },
  { days: 30, label: '30 days' },
  { days: 90, label: '90 days' },
]

const fmtDuration = (sec: number) => {
  if (sec < 60) return `${sec}s`
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}m ${String(s).padStart(2, '0')}s`
}
const pct = (n: number) => `${Math.round(n * 100)}%`
const ago = (iso: string) => {
  const s = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 1000))
  if (s < 90) return `${s}s ago`
  if (s < 5400) return `${Math.round(s / 60)}m ago`
  if (s < 129600) return `${Math.round(s / 3600)}h ago`
  return `${Math.round(s / 86400)}d ago`
}
const HEAT_LABEL: Record<Heat, string> = { hot: 'Hot lead', warm: 'Warm', casual: 'Casual', bounced: 'Bounced' }

interface Props {
  token: string
}

export default function AnalyticsPanel({ token }: Props) {
  const [tab, setTab] = useState<Tab>('overview')
  const [days, setDays] = useState(30)
  const [report, setReport] = useState<Report | null>(null)
  const [setupNeeded, setSetupNeeded] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [titles, setTitles] = useState<Record<string, string>>({})
  const [people, setPeople] = useState<PresencePerson[]>([])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/analytics?days=${days}&tz=${encodeURIComponent(Intl.DateTimeFormat().resolvedOptions().timeZone)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (json.setupNeeded) {
        setSetupNeeded(true)
        setReport(null)
      } else if (!res.ok) {
        throw new Error(json.error || 'Failed to load analytics')
      } else {
        setSetupNeeded(false)
        setReport(json as Report)
      }
    } catch (e) {
      setError((e as Error).message)
    }
    setLoading(false)
  }, [days, token])

  useEffect(() => {
    load()
  }, [load])

  // Project names for slugs.
  useEffect(() => {
    fetch('/api/admin/projects', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((rows: { slug: string; title: string }[]) =>
        setTitles(Object.fromEntries(rows.map((r) => [r.slug, r.title])))
      )
      .catch(() => undefined)
  }, [token])

  // Who is on the site right now, and where.
  useEffect(() => openPresence('admin-observer', (e) => setPeople(e.people), false), [])

  const name = (slug: string) => titles[slug] || slug
  const nicePath = (p: string) => {
    if (p === '/') return 'Home'
    const m = /^\/project\/([^/]+)/.exec(p)
    if (m) return name(decodeURIComponent(m[1]))
    if (p === '/project') return 'Work index'
    return p.replace('/', '').replace(/^./, (c) => c.toUpperCase())
  }

  const live = useMemo(() => {
    const m = new Map<string, number>()
    for (const p of people) {
      const k = p.path || '/'
      m.set(k, (m.get(k) || 0) + 1)
    }
    return Array.from(m, ([path, n]) => ({ path, n })).sort((a, b) => b.n - a.n)
  }, [people])

  return (
    <Wrap>
      <Head>
        <h2>Analytics</h2>
        <div className="ctrls">
          <Ranges>
            {RANGES.map((r) => (
              <button key={r.days} className={days === r.days ? 'on' : ''} onClick={() => setDays(r.days)}>
                {r.label}
              </button>
            ))}
          </Ranges>
          <button className="refresh" onClick={load} disabled={loading}>
            {loading ? 'Loading…' : 'Refresh'}
          </button>
        </div>
      </Head>

      <LiveCard>
        <div className="num">
          <i /> {people.length}
        </div>
        <div>
          <strong>Online now</strong>
          <div className="where">
            {live.length === 0 && <span className="muted">No one right now</span>}
            {live.map((l) => (
              <span key={l.path} className="chip">
                {nicePath(l.path)} {l.n > 1 && <b>×{l.n}</b>}
              </span>
            ))}
          </div>
        </div>
      </LiveCard>

      {setupNeeded && (
        <Notice>
          <strong>One-time setup needed.</strong> Open your Supabase project → SQL editor, paste the contents of{' '}
          <code>supabase/analytics-v2.sql</code> and run it. The new analytics tables will be created and this page will
          start filling with data.
        </Notice>
      )}
      {error && <Notice className="err">{error}</Notice>}

      {report && (
        <>
          <TabBar>
            {TABS.map((t) => (
              <button key={t.key} className={tab === t.key ? 'on' : ''} onClick={() => setTab(t.key)}>
                {t.label}
                {t.key === 'issues' && report.issues.length > 0 && <b>{report.issues.length}</b>}
                {t.key === 'visitors' && report.overview.hotLeads > 0 && <b className="hot">{report.overview.hotLeads}</b>}
              </button>
            ))}
          </TabBar>

          {tab === 'overview' && <Overview r={report} nicePath={nicePath} name={name} />}
          {tab === 'projects' && <Projects r={report} name={name} />}
          {tab === 'visitors' && <Visitors r={report} nicePath={nicePath} name={name} />}
          {tab === 'audience' && <Audience r={report} />}
          {tab === 'issues' && <Issues r={report} nicePath={nicePath} />}
        </>
      )}
    </Wrap>
  )
}

/* ============================ Overview ============================ */
function Overview({
  r,
  nicePath,
  name,
}: {
  r: Report
  nicePath: (p: string) => string
  name: (s: string) => string
}) {
  const o = r.overview
  const maxDay = Math.max(1, ...r.daily.map((d) => d.sessions))
  const maxHour = Math.max(1, ...r.hours)
  const maxWd = Math.max(1, ...r.weekdays)
  const top = r.funnel[0]?.count || 1
  const hot = r.sessions.filter((s) => s.heat === 'hot').slice(0, 4)
  const best = r.projects[0]

  return (
    <>
      <Grid>
        <Stat label="Visits" value={o.sessions} hint={`${o.visitors} unique visitors`} />
        <Stat label="Avg time on site" value={fmtDuration(o.avgSeconds)} hint="active time, not an open tab" />
        <Stat label="Bounce rate" value={pct(o.bounceRate)} hint="left within seconds" />
        <Stat
          label="Returning"
          value={pct(o.returningRate)}
          hint={r.returningVisitors.length ? `${r.returningVisitors.length} came back, see below` : 'have visited before'}
          accent={r.returningVisitors.length > 0}
        />
        <Stat label="Hot leads" value={o.hotLeads} hint="strong hiring signals" accent />
        <Stat label="Page views" value={o.pageViews} hint={`${(o.pageViews / Math.max(1, o.sessions)).toFixed(1)} per visit`} />
      </Grid>

      {best && (
        <Callout>
          <small>Visitors love</small>
          <strong>{name(best.slug)}</strong>
          <span>
            {best.views} views · {fmtDuration(best.avgSeconds)} avg · {best.avgScroll}% read
            {best.linkClicks > 0 && ` · ${best.linkClicks} link click${best.linkClicks > 1 ? 's' : ''}`}
          </span>
        </Callout>
      )}

      {r.returningVisitors.length > 0 && (
        <Panel>
          <h3>Came back</h3>
          <p className="sub">
            People who returned. Coming back is the warmest signal there is: they thought about it and chose to look
            again.
          </p>
          <div className="stack">
            {r.returningVisitors.slice(0, 6).map((v) => (
              <Session key={v.id} className="warm">
                <div className="top">
                  <span className="heat hot">{v.visits > 1 ? `${v.visits} visits` : 'Returning'}</span>
                  <strong>{v.place}</strong>
                  {v.device && <span className="muted">{v.device}</span>}
                  <span className="when muted">last seen {ago(v.lastAt)}</span>
                </div>
                <div className="meta">
                  <span>
                    via <b>{v.source}</b>
                  </span>
                  <span>{fmtDuration(v.seconds)} active in total</span>
                  {v.projects.length > 0 && <span>Read: {v.projects.map(name).join(', ')}</span>}
                  {v.actions.length > 0 && <span>{v.actions.join(' · ')}</span>}
                </div>
              </Session>
            ))}
          </div>
        </Panel>
      )}

      {hot.length > 0 && (
        <Panel>
          <h3>Hot leads</h3>
          <p className="sub">Visits with strong signs of interest: long reads, several projects, resume or contact actions.</p>
          <div className="stack">
            {hot.map((s) => (
              <SessionCard key={s.id} s={s} nicePath={nicePath} name={name} compact />
            ))}
          </div>
        </Panel>
      )}

      <TwoCol>
        <Panel>
          <h3>Visits per day</h3>
          <Bars>
            {r.daily.map((d) => (
              <div key={d.date} title={`${d.date}: ${d.sessions} visits, ${d.views} page views`}>
                <span style={{ height: `${(d.sessions / maxDay) * 100}%` }} />
                <small>{r.days <= 31 ? d.date.slice(8) : d.date.slice(5, 7)}</small>
              </div>
            ))}
          </Bars>
        </Panel>

        <Panel>
          <h3>Where visitors drop off</h3>
          {r.funnel.map((f, i) => (
            <FunnelRow key={f.label}>
              <div className="top">
                <span>{f.label}</span>
                <b>
                  {f.count}
                  {i > 0 && <em>{pct(f.count / top)}</em>}
                </b>
              </div>
              <div className="bar">
                <span style={{ width: `${(f.count / top) * 100}%` }} />
              </div>
            </FunnelRow>
          ))}
        </Panel>
      </TwoCol>

      <TwoCol>
        <Panel>
          <h3>When people visit</h3>
          <p className="sub">By the visitor&apos;s own local time.</p>
          <Hours>
            {r.hours.map((n, h) => (
              <div key={h} title={`${h}:00 — ${n} visits`}>
                <span style={{ height: `${(n / maxHour) * 100}%` }} />
                {h % 6 === 0 && <small>{h}h</small>}
              </div>
            ))}
          </Hours>
          <Hours className="wd">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
              <div key={d} title={`${d}: ${r.weekdays[i]} visits`}>
                <span style={{ height: `${(r.weekdays[i] / maxWd) * 100}%` }} />
                <small>{d}</small>
              </div>
            ))}
          </Hours>
        </Panel>

        <Panel>
          <h3>What people do</h3>
          <List rows={r.actions} empty="No resume, email or contact actions yet" />
        </Panel>
      </TwoCol>
    </>
  )
}

/* ============================ Projects ============================ */
function Projects({ r, name }: { r: Report; name: (s: string) => string }) {
  const maxLoved = Math.max(1, ...r.projects.map((p) => p.loved))
  return (
    <Panel>
      <h3>Project performance</h3>
      <p className="sub">
        Ranked by how much visitors engage: time spent, how far they read, link clicks and repeat views. Flags point to
        anything that might be going wrong.
      </p>
      {r.projects.length === 0 && <p className="muted">No project views yet in this period.</p>}
      <Table>
        {r.projects.length > 0 && (
          <div className="row head">
            <span>Project</span>
            <span>Views</span>
            <span>Avg time</span>
            <span>Read</span>
            <span>Link clicks</span>
            <span>Left fast</span>
          </div>
        )}
        {r.projects.map((p: ProjectStat) => (
          <div key={p.slug} className="item">
            <div className="row">
              <span className="name">{name(p.slug)}</span>
              <span>
                {p.views}
                <small> / {p.visitors} people</small>
              </span>
              <span>{fmtDuration(p.avgSeconds)}</span>
              <span>{p.avgScroll}%</span>
              <span>{p.linkClicks}</span>
              <span className={p.bounceRate > 0.5 ? 'warn' : ''}>{pct(p.bounceRate)}</span>
            </div>
            <div className="meter">
              <span style={{ width: `${(p.loved / maxLoved) * 100}%` }} />
            </div>
            {p.flags.length > 0 && (
              <div className="flags">
                {p.flags.map((f) => (
                  <em key={f} className={f === 'Most loved' ? 'good' : 'bad'}>
                    {f}
                  </em>
                ))}
              </div>
            )}
          </div>
        ))}
      </Table>
    </Panel>
  )
}

/* ============================ Visitors ============================ */
function Visitors({
  r,
  nicePath,
  name,
}: {
  r: Report
  nicePath: (p: string) => string
  name: (s: string) => string
}) {
  const [filter, setFilter] = useState<Heat | 'all' | 'returning'>('all')
  const shown = r.sessions.filter((s) =>
    filter === 'all' ? true : filter === 'returning' ? s.returning || s.visitNo > 1 : s.heat === filter
  )
  return (
    <Panel>
      <h3>Recent visits</h3>
      <p className="sub">
        Anonymous: you see where someone came from and what they did, not who they are. A &ldquo;hot&rdquo; visit
        combines time spent, projects read and actions like downloading your resume.
      </p>
      <Chips>
        {(['all', 'returning', 'hot', 'warm', 'casual', 'bounced'] as const).map((f) => (
          <button key={f} className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f === 'returning' ? 'Returning' : HEAT_LABEL[f]}
          </button>
        ))}
      </Chips>
      <div className="stack">
        {shown.length === 0 && <p className="muted">No visits match.</p>}
        {shown.map((s) => (
          <SessionCard key={s.id} s={s} nicePath={nicePath} name={name} />
        ))}
      </div>
    </Panel>
  )
}

function SessionCard({
  s,
  nicePath,
  name,
  compact,
}: {
  s: SessionSummary
  nicePath: (p: string) => string
  name: (s: string) => string
  compact?: boolean
}) {
  const where = [s.city, s.country].filter(Boolean).join(', ') || 'Unknown location'
  return (
    <Session className={s.heat}>
      <div className="top">
        <span className={`heat ${s.heat}`}>{HEAT_LABEL[s.heat]}</span>
        <strong>{where}</strong>
        <span className="muted">
          {s.device} · {s.browser} · {s.os}
        </span>
        <span className="when muted">{ago(s.at)}</span>
      </div>
      <div className="meta">
        <span>
          via <b>{s.source}</b>
        </span>
        {s.visitNo > 1 ? (
          <span>
            <b>visit #{s.visitNo}</b> from this browser
          </span>
        ) : (
          s.returning && <span>returning visitor</span>
        )}
        <span>{fmtDuration(s.seconds)} active</span>
        <span>
          {s.pages} page{s.pages === 1 ? '' : 's'}
        </span>
        <span>
          engagement <b>{s.score}</b>/100
        </span>
      </div>
      {!compact && s.journey.length > 0 && (
        <div className="journey">
          {s.journey.map((j, i) => (
            <span key={i} className="step">
              {nicePath(j.path)}
              <small>
                {fmtDuration(j.seconds)} · {j.scroll}%
              </small>
            </span>
          ))}
        </div>
      )}
      {s.actions.length > 0 && (
        <div className="actions">
          {s.actions.map((a) => (
            <em key={a}>{a}</em>
          ))}
        </div>
      )}
      {compact && s.projects.length > 0 && (
        <div className="meta">
          <span>Read: {s.projects.map(name).join(', ')}</span>
        </div>
      )}
    </Session>
  )
}

/* ============================ Audience ============================ */
function Audience({ r }: { r: Report }) {
  return (
    <TwoCol>
      <Panel>
        <h3>Where they come from</h3>
        <List rows={r.sources} empty="No data yet" />
      </Panel>
      {r.campaigns.length > 0 && (
        <Panel>
          <h3>Tracked links</h3>
          <List
            rows={r.campaigns.map((c) => ({
              name: c.name,
              count: c.visits,
            }))}
            empty="No tracked links yet"
          />
          {r.campaigns.map((c) => (
            <p key={c.name} className="muted" style={{ margin: '0.5rem 0 0' }}>
              <b>{c.name}</b>: {c.visits} visit{c.visits === 1 ? '' : 's'} · {fmtDuration(c.avgSeconds)} avg ·{' '}
              {c.projectReaders} read a project · {c.resumes} resume · {c.messages} message
            </p>
          ))}
        </Panel>
      )}
      <Panel>
        <h3>Countries</h3>
        <List rows={r.countries} empty="Location appears once the site is live on Vercel" />
      </Panel>
      <Panel>
        <h3>Cities</h3>
        <List rows={r.cities} empty="Location appears once the site is live on Vercel" />
      </Panel>
      <Panel>
        <h3>Devices</h3>
        <List rows={r.devices} empty="No data yet" />
        <h3 style={{ marginTop: '1.4rem' }}>Browsers</h3>
        <List rows={r.browsers} empty="No data yet" />
        <h3 style={{ marginTop: '1.4rem' }}>Operating systems</h3>
        <List rows={r.systems} empty="No data yet" />
      </Panel>
    </TwoCol>
  )
}

/* ============================ Issues ============================ */
const ISSUE_LABEL: Record<IssueRow['kind'], string> = {
  js_error: 'Script error',
  resource_error: 'Broken file',
  rage_click: 'Rapid clicking',
  slow_page: 'Slow page',
  not_found: 'Page not found',
  form_error: 'Form problem',
}

function Issues({ r, nicePath }: { r: Report; nicePath: (p: string) => string }) {
  return (
    <Panel>
      <h3>Things that may have gone wrong</h3>
      <p className="sub">
        Errors visitors hit, broken images, pages that load slowly, and places people clicked repeatedly because
        something didn&apos;t respond.
      </p>
      {r.issues.length === 0 && <p className="good-note">No problems detected in this period.</p>}
      <div className="stack">
        {r.issues.map((i, n) => (
          <IssueItem key={n}>
            <span className={`kind ${i.kind}`}>{ISSUE_LABEL[i.kind]}</span>
            <div className="body">
              <strong>{i.title}</strong>
              <small>
                on {nicePath(i.path)} · {i.sessions} visit{i.sessions === 1 ? '' : 's'} affected · last {ago(i.lastSeen)}
              </small>
            </div>
            <b>×{i.count}</b>
          </IssueItem>
        ))}
      </div>
    </Panel>
  )
}

/* ============================ shared bits ============================ */
function Stat({ label, value, hint, accent }: { label: string; value: React.ReactNode; hint?: string; accent?: boolean }) {
  return (
    <StatBox className={accent ? 'accent' : ''}>
      <small>{label}</small>
      <b>{value}</b>
      {hint && <span>{hint}</span>}
    </StatBox>
  )
}

function List({ rows, empty }: { rows: Count[]; empty: string }) {
  const max = Math.max(1, ...rows.map((r) => r.count))
  if (!rows.length) return <p className="muted">{empty}</p>
  return (
    <Rows>
      {rows.map((r) => (
        <div key={r.name}>
          <div className="top">
            <span>{r.name}</span>
            <b>{r.count}</b>
          </div>
          <div className="bar">
            <span style={{ width: `${(r.count / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </Rows>
  )
}

/* ============================ styles ============================ */
const Wrap = styled.div`
  color: ${MINT};
  .muted {
    color: ${DIM};
  }
  .good-note {
    color: #3ddc84;
  }
`
const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.2rem;
  h2 {
    margin: 0;
    font-family: 'Playfair Display SC', serif;
    font-size: 1.6rem;
  }
  .ctrls {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
  }
  .refresh {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    border: 1px solid ${LINE};
    background: ${CARD};
    color: ${MINT};
    font: inherit;
    font-size: 0.8rem;
    cursor: pointer;
  }
`
const Ranges = styled.div`
  display: flex;
  border: 1px solid ${LINE};
  border-radius: 8px;
  overflow: hidden;
  button {
    padding: 0.5rem 0.9rem;
    border: 0;
    background: transparent;
    color: ${DIM};
    font: inherit;
    font-size: 0.8rem;
    cursor: pointer;
  }
  button.on {
    background: ${MINT};
    color: #1f1f1f;
  }
`
const LiveCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
  background: ${CARD};
  border: 1px solid ${LINE};
  border-radius: 14px;
  .num {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 2.2rem;
    font-weight: 600;
  }
  .num i {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #3ddc84;
    box-shadow: 0 0 10px #3ddc84;
  }
  .where {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 0.4rem;
  }
  .chip {
    padding: 0.2rem 0.7rem;
    border: 1px solid ${LINE};
    border-radius: 999px;
    font-size: 0.8rem;
  }
`
const Notice = styled.div`
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 200, 80, 0.35);
  background: rgba(255, 200, 80, 0.07);
  border-radius: 12px;
  font-size: 0.92rem;
  line-height: 1.6;
  &.err {
    border-color: rgba(255, 107, 107, 0.4);
    background: rgba(255, 107, 107, 0.07);
  }
  code {
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.08);
  }
`
const TabBar = styled.div`
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin: 1.2rem 0;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid ${LINE};
  button {
    padding: 0.55rem 1rem;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: ${DIM};
    font: inherit;
    font-size: 0.85rem;
    cursor: pointer;
  }
  button.on {
    background: rgba(231, 250, 236, 0.1);
    color: ${MINT};
  }
  b {
    margin-left: 0.5rem;
    padding: 0.05rem 0.45rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.12);
    font-size: 0.7rem;
  }
  b.hot {
    background: #ff8a3d;
    color: #1f1f1f;
  }
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 0.9rem;
  margin-bottom: 1rem;
`
const StatBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1rem 1.15rem;
  background: ${CARD};
  border: 1px solid ${LINE};
  border-radius: 14px;
  small {
    color: ${DIM};
    font-size: 0.78rem;
  }
  b {
    font-size: 1.9rem;
    font-weight: 600;
  }
  span {
    color: ${DIM};
    font-size: 0.74rem;
  }
  &.accent b {
    color: #ff8a3d;
  }
`
const Callout = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.9rem;
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(61, 220, 132, 0.3);
  background: rgba(61, 220, 132, 0.06);
  border-radius: 14px;
  small {
    color: #3ddc84;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-size: 0.72rem;
  }
  strong {
    font-family: 'Playfair Display SC', serif;
    font-size: 1.4rem;
  }
  span {
    color: ${DIM};
    font-size: 0.85rem;
  }
`
const TwoCol = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`
const Panel = styled.section`
  padding: 1.25rem 1.35rem;
  margin-bottom: 1rem;
  background: ${CARD};
  border: 1px solid ${LINE};
  border-radius: 14px;
  h3 {
    margin: 0 0 0.5rem;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${DIM};
  }
  .sub {
    margin: 0 0 1rem;
    font-size: 0.85rem;
    line-height: 1.55;
    color: ${DIM};
  }
  .stack {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }
  .muted {
    color: ${DIM};
  }
`
const Bars = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 150px;
  margin-top: 0.6rem;
  > div {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    gap: 4px;
  }
  span {
    width: 100%;
    min-height: 2px;
    background: ${MINT};
    opacity: 0.85;
    border-radius: 3px 3px 0 0;
  }
  small {
    font-size: 0.62rem;
    color: ${DIM};
  }
`
const Hours = styled(Bars)`
  height: 70px;
  &.wd {
    margin-top: 1.4rem;
  }
  span {
    background: #3ddc84;
    opacity: 0.75;
  }
`
const FunnelRow = styled.div`
  margin-bottom: 0.8rem;
  .top {
    display: flex;
    justify-content: space-between;
    font-size: 0.88rem;
    margin-bottom: 0.3rem;
  }
  .top em {
    margin-left: 0.6rem;
    font-style: normal;
    font-weight: 400;
    color: ${DIM};
    font-size: 0.75rem;
  }
  .bar {
    height: 6px;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 3px;
    overflow: hidden;
  }
  .bar span {
    display: block;
    height: 100%;
    background: ${MINT};
  }
`
const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  .top {
    display: flex;
    justify-content: space-between;
    font-size: 0.88rem;
    margin-bottom: 0.25rem;
  }
  .bar {
    height: 4px;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 2px;
    overflow: hidden;
  }
  .bar span {
    display: block;
    height: 100%;
    background: ${MINT};
    opacity: 0.8;
  }
`
const Table = styled.div`
  .row {
    display: grid;
    grid-template-columns: 2fr 1.3fr 1fr 0.8fr 1fr 0.9fr;
    gap: 0.8rem;
    align-items: baseline;
    font-size: 0.9rem;
  }
  .row.head {
    padding-bottom: 0.6rem;
    color: ${DIM};
    font-size: 0.7rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .item {
    padding: 0.9rem 0;
    border-top: 1px solid ${LINE};
  }
  .name {
    font-family: 'Playfair Display SC', serif;
    font-size: 1.15rem;
  }
  small {
    color: ${DIM};
    font-size: 0.72rem;
  }
  .warn {
    color: #ff8a3d;
  }
  .meter {
    height: 3px;
    margin-top: 0.6rem;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 2px;
    overflow: hidden;
  }
  .meter span {
    display: block;
    height: 100%;
    background: #3ddc84;
  }
  .flags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 0.6rem;
  }
  .flags em {
    padding: 0.15rem 0.6rem;
    border-radius: 999px;
    font-style: normal;
    font-size: 0.72rem;
  }
  .flags em.good {
    background: rgba(61, 220, 132, 0.15);
    color: #3ddc84;
  }
  .flags em.bad {
    background: rgba(255, 138, 61, 0.15);
    color: #ff8a3d;
  }
  @media (max-width: 800px) {
    .row {
      grid-template-columns: 1fr 1fr;
    }
    .row.head {
      display: none;
    }
  }
`
const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1rem;
  button {
    padding: 0.4rem 0.9rem;
    border: 1px solid ${LINE};
    border-radius: 999px;
    background: transparent;
    color: ${DIM};
    font: inherit;
    font-size: 0.78rem;
    cursor: pointer;
  }
  button.on {
    background: ${MINT};
    border-color: ${MINT};
    color: #1f1f1f;
  }
`
const Session = styled.div`
  padding: 0.95rem 1.1rem;
  border: 1px solid ${LINE};
  border-left-width: 3px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  &.hot {
    border-left-color: #ff8a3d;
  }
  &.warm {
    border-left-color: #f3c64a;
  }
  &.casual {
    border-left-color: #6ea8ff;
  }
  &.bounced {
    border-left-color: rgba(255, 255, 255, 0.2);
  }
  .top {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.8rem;
  }
  .top .when {
    margin-left: auto;
    font-size: 0.78rem;
  }
  .heat {
    padding: 0.1rem 0.6rem;
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .heat.hot {
    background: #ff8a3d;
    color: #1f1f1f;
  }
  .heat.warm {
    background: rgba(243, 198, 74, 0.2);
    color: #f3c64a;
  }
  .heat.casual {
    background: rgba(110, 168, 255, 0.18);
    color: #6ea8ff;
  }
  .heat.bounced {
    background: rgba(255, 255, 255, 0.08);
    color: ${DIM};
  }
  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 0.5rem;
    font-size: 0.8rem;
    color: ${DIM};
  }
  .meta b {
    color: ${MINT};
  }
  .journey {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 0.7rem;
  }
  .step {
    padding: 0.25rem 0.7rem;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    font-size: 0.8rem;
  }
  .step small {
    margin-left: 0.5rem;
    color: ${DIM};
    font-size: 0.7rem;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 0.7rem;
  }
  .actions em {
    padding: 0.15rem 0.65rem;
    border-radius: 999px;
    background: rgba(61, 220, 132, 0.14);
    color: #3ddc84;
    font-style: normal;
    font-size: 0.74rem;
  }
`
const IssueItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
  padding: 0.85rem 1rem;
  border: 1px solid ${LINE};
  border-radius: 12px;
  .kind {
    flex-shrink: 0;
    padding: 0.15rem 0.6rem;
    border-radius: 999px;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: rgba(255, 138, 61, 0.15);
    color: #ff8a3d;
  }
  .kind.js_error,
  .kind.form_error {
    background: rgba(255, 107, 107, 0.15);
    color: #ff6b6b;
  }
  .body {
    flex: 1;
    min-width: 0;
  }
  .body strong {
    display: block;
    font-size: 0.9rem;
    font-weight: 500;
    overflow-wrap: anywhere;
  }
  .body small {
    color: ${DIM};
    font-size: 0.75rem;
  }
`
