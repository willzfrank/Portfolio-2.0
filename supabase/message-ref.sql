-- Remember which tracked link (?ref=) a contact message came from. Safe to re-run.
alter table messages add column if not exists ref text;
