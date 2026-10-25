-- Optional: delete analytics older than 12 months. Run on demand, or schedule it
-- (Supabase Dashboard > Integrations > Cron, or pg_cron) to run weekly.
delete from events where created_at < now() - interval '12 months';
delete from page_views where created_at < now() - interval '12 months';
delete from sessions where started_at < now() - interval '12 months';
