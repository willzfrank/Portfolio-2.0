/** Shapes shared by the collector, the report builder and the admin UI. */

export interface SessionRow {
  id: string
  visitor_id: string
  started_at: string
  last_seen_at: string
  country: string | null
  region: string | null
  city: string | null
  device: string | null
  browser: string | null
  os: string | null
  language: string | null
  timezone: string | null
  screen_w: number | null
  referrer_host: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  landing_path: string | null
  is_returning: boolean
}

export interface ViewRow {
  view_id: string | null
  session_id: string | null
  visitor_id: string
  path: string
  created_at: string
  duration_ms: number
  max_scroll: number
}

export interface EventRow {
  session_id: string | null
  visitor_id: string | null
  type: string
  path: string | null
  meta: Record<string, unknown>
  created_at: string
}

export type Heat = 'hot' | 'warm' | 'casual' | 'bounced'

export interface JourneyStep {
  path: string
  seconds: number
  scroll: number
}

export interface SessionSummary {
  id: string
  at: string
  country: string | null
  city: string | null
  device: string | null
  browser: string | null
  os: string | null
  source: string
  returning: boolean
  /** Which visit this is for the same browser within the report window (1 = first). */
  visitNo: number
  pages: number
  seconds: number
  score: number
  heat: Heat
  journey: JourneyStep[]
  actions: string[]
  projects: string[]
}

export interface ProjectStat {
  slug: string
  views: number
  visitors: number
  avgSeconds: number
  avgScroll: number
  linkClicks: number
  bounceRate: number
  errors: number
  slowLcpMs: number | null
  loved: number
  flags: string[]
}

export interface Count {
  name: string
  count: number
}

export interface IssueRow {
  kind: 'js_error' | 'resource_error' | 'rage_click' | 'slow_page' | 'not_found' | 'form_error'
  title: string
  path: string
  count: number
  sessions: number
  lastSeen: string
}

/** A browser that came back: the warmest signal there is. */
export interface ReturningVisitor {
  id: string
  place: string
  device: string | null
  source: string
  visits: number
  firstAt: string
  lastAt: string
  seconds: number
  projects: string[]
  actions: string[]
}

export interface CampaignStat {
  name: string
  visits: number
  avgSeconds: number
  projectReaders: number
  resumes: number
  messages: number
}

export interface Report {
  days: number
  generatedAt: string
  overview: {
    sessions: number
    visitors: number
    pageViews: number
    avgSeconds: number
    bounceRate: number
    returningRate: number
    hotLeads: number
  }
  daily: { date: string; sessions: number; views: number }[]
  projects: ProjectStat[]
  sources: Count[]
  campaigns: CampaignStat[]
  returningVisitors: ReturningVisitor[]
  countries: Count[]
  cities: Count[]
  devices: Count[]
  browsers: Count[]
  systems: Count[]
  hours: number[]
  weekdays: number[]
  funnel: { label: string; count: number }[]
  actions: Count[]
  issues: IssueRow[]
  sessions: SessionSummary[]
}
