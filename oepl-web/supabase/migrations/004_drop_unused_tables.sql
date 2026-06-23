-- Optional cleanup: remove tables no longer used by the app.
-- Safe to run if you previously created professor / site_content tables.

drop table if exists public.professor_timeline cascade;
drop table if exists public.professor cascade;
-- drop table if exists public.site_content cascade;  -- uncomment if you want to remove legacy JSON table
