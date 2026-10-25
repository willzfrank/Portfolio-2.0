-- Run in the Supabase SQL editor (after schema.sql).
create table if not exists page_views (
  id bigint generated always as identity primary key,
  visitor_id text not null,
  path text not null,
  referrer text,
  device text,
  created_at timestamptz not null default now()
);
create index if not exists page_views_created_idx on page_views (created_at desc);

-- Only the service role (API routes) reads/writes; no public policies.
alter table page_views enable row level security;
