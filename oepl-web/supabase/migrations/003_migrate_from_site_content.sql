-- Migrate existing site_content JSON blob into normalized tables.
-- Skips if site_content row is missing. Professor is NOT migrated (localStorage only).

do $$
declare
  payload jsonb;
begin
  select sc.payload into payload
  from public.site_content sc
  where sc.id = 'default';

  if payload is null then
    raise notice 'No site_content row found — skipping migration.';
    return;
  end if;

  insert into public.news (id, badge, date, title_kr, title_en, excerpt_kr, excerpt_en)
  select
    n->>'id', n->>'badge', n->>'date',
    n->>'titleKr', n->>'titleEn', n->>'excerptKr', n->>'excerptEn'
  from jsonb_array_elements(coalesce(payload->'news', '[]'::jsonb)) as n
  on conflict (id) do nothing;

  insert into public.publications (id, year, month, day, type, title, title_ko, authors, journal, volume, doi)
  select
    p->>'id',
    (p->>'year')::int, (p->>'month')::int, (p->>'day')::int,
    p->>'type', p->>'title', p->>'titleKo', p->>'authors', p->>'journal', p->>'volume',
    coalesce(p->>'doi', '')
  from jsonb_array_elements(coalesce(payload->'publications', '[]'::jsonb)) as p
  on conflict (id) do nothing;

  insert into public.gallery (id, title, date, category)
  select g->>'id', g->>'title', g->>'date', g->>'category'
  from jsonb_array_elements(coalesce(payload->'gallery', '[]'::jsonb)) as g
  on conflict (id) do nothing;

  insert into public.patents (id, number, title, title_en, date, status, inventors)
  select
    pt->>'id', pt->>'number', pt->>'title', pt->>'titleEn',
    pt->>'date', pt->>'status', pt->>'inventors'
  from jsonb_array_elements(coalesce(payload->'patents', '[]'::jsonb)) as pt
  on conflict (id) do nothing;

  insert into public.members (
    id, member_group, name_ko, name_en, degree,
    email, field_kr, field_en, year, month, affiliation_kr, affiliation_en
  )
  select
    m->>'id', grp.grp, m->>'nameKo', m->>'nameEn', m->>'degree',
    m->>'email', m->>'fieldKr', m->>'fieldEn',
    nullif(m->>'year', '')::int, nullif(m->>'month', '')::int,
    m->>'affiliationKr', m->>'affiliationEn'
  from (
    values
      ('postdocs', coalesce(payload->'members'->'postdocs', '[]'::jsonb)),
      ('gradStudents', coalesce(payload->'members'->'gradStudents', '[]'::jsonb)),
      ('phdAlumni', coalesce(payload->'members'->'phdAlumni', '[]'::jsonb)),
      ('msAlumni', coalesce(payload->'members'->'msAlumni', '[]'::jsonb))
  ) as grp(grp, arr)
  cross join lateral jsonb_array_elements(grp.arr) as m
  on conflict (id) do nothing;

  raise notice 'Migration from site_content completed.';
end $$;
