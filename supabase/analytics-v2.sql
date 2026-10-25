-- Run in the Supabase SQL editor (after analytics.sql). Safe to re-run.
-- Anonymous, cookie-less analytics: no IP addresses are stored.

-- One row per visit (a visitor can have many; a new one starts after 30 min idle).
create table if not exists sessions (
  id text primary key,                 -- client-generated
  visitor_id text not null,
  started_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  country text,                        -- ISO code from the hosting edge, e.g. NG
  region text,
  city text,
  device text,                         -- mobile | tablet | desktop
  browser text,
  os text,
  language text,
  timezone text,
  screen_w int,
  referrer_host text,                  -- e.g. www.linkedin.com (null = direct)
  utm_source text,
  utm_medium text,
  utm_campaign text,
  landing_path text,
  is_returning boolean not null default false
);
create index if not exists sessions_started_idx on sessions (started_at desc);
create index if not exists sessions_visitor_idx on sessions (visitor_id);

-- Per-page-view detail (extends the existing table).
alter table page_views add column if not exists view_id text;
alter table page_views add column if not exists session_id text;
alter table page_views add column if not exists duration_ms int not null default 0;  -- active time
alter table page_views add column if not exists max_scroll int not null default 0;    -- 0-100
create unique index if not exists page_views_view_id_idx on page_views (view_id);
create index if not exists page_views_session_idx on page_views (session_id);

-- Things people do or things that go wrong.
create table if not exists events (
  id bigint generated always as identity primary key,
  session_id text,
  visitor_id text,
  type text not null,   -- resume | email | social | outbound | form_start | form_submit | form_error
                        -- lens | js_error | resource_error | rage_click | not_found | vitals
  path text,
  meta jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists events_created_idx on events (created_at desc);
create index if not exists events_type_idx on events (type);
create index if not exists events_session_idx on events (session_id);

-- Only the service role (API routes) reads/writes.
alter table sessions enable row level security;
alter table events enable row level security;
