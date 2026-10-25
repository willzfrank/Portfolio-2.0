-- Run this in the Supabase SQL editor.
-- All writes go through the Next.js API routes using the service-role key,
-- so RLS only needs to allow public reads of published content.

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  position int not null default 0,
  title text not null,
  slug text not null unique,
  type text not null default '',
  technologies text[] not null default '{}',
  timeline text not null default '',
  description text not null default '',
  long_description text not null default '',
  live_url text not null default '',
  github_url text,
  image text not null default '',
  category text not null default 'web-design'
    check (category in ('web-design','ai','hr','ecommerce','tech')),
  contributors jsonb not null default '[]',
  contributions text[] not null default '{}',
  images jsonb not null default '[]',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- key/value site content (about text, hero text, etc.)
create table if not exists site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table projects enable row level security;
alter table site_content enable row level security;
alter table messages enable row level security;

create policy "public read published projects" on projects
  for select using (published);
create policy "public read site content" on site_content
  for select using (true);
-- messages: no policies => only the service role can read/write.

-- Public bucket for project images.
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;
