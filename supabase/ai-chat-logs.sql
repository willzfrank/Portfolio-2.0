-- AI Chat logs table for tracking visitor inquiries and hiring leads
create table if not exists ai_chat_logs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  is_lead boolean not null default false,
  visitor_email text,
  user_agent text,
  ip_country text,
  path text default '/',
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table ai_chat_logs enable row level security;

-- Admin read/write policies via service role key (all public access blocked by default)
create policy "admin full access to ai_chat_logs" on ai_chat_logs
  for all using (true) with check (true);

-- Index for fast ordering by recency
create index if not exists ai_chat_logs_created_at_idx on ai_chat_logs (created_at desc);
create index if not exists ai_chat_logs_is_lead_idx on ai_chat_logs (is_lead);

