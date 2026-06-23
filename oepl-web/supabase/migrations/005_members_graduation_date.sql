-- members: year/month/affiliation → graduation_date

alter table public.members add column if not exists graduation_date date;

update public.members
set graduation_date = make_date(year, month, 1)
where year is not null and month is not null and graduation_date is null;

alter table public.members drop column if exists year;
alter table public.members drop column if exists month;
alter table public.members drop column if exists affiliation_kr;
alter table public.members drop column if exists affiliation_en;
