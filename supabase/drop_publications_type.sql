-- Remove unused publications.type (Journal/Conference was never used in admin or public UI)
alter table public.publications drop column if exists type;
