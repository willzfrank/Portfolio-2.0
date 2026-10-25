-- Store links (App Store, Google Play, live site...) shown on each project page. Safe to re-run.
alter table projects add column if not exists links jsonb not null default '[]';
