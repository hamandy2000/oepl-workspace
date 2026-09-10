-- Supabase Auth 관리자 허용목록
--
-- 다른 테이블 SQL 파일보다 먼저 실행할 것. 그 파일들의 RLS 정책이
-- public.is_admin()을 호출하기 때문이다.
--
-- 로그인할 수 있다는 것과 관리자라는 것은 다르다. Supabase Auth는 누가 계정을
-- 가졌는지를 정하고, 이 테이블은 그중 누가 쓰기를 할 수 있는지를 정한다. 로그인은
-- 되지만 여기 없는 사용자는 비로그인 방문자와 똑같은 범위만 읽을 수 있다.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  note text,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- 아래 정책이 이 함수를 호출하므로 함수를 먼저 만들어야 한다. 순서를 바꾸면
-- 정책 생성 시점에 42883(function does not exist)으로 실패한다.
--
-- security definer로 선언해 이 조회 자체가 admin_users의 RLS를 타지 않게 한다
-- (그러면 재귀한다). search_path를 고정해 호출자가 테이블을 가로챌 수 없게 한다.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- 관리자는 명단을 조회할 수 있다. API로는 아무도 수정할 수 없다 — 아래 grant가
-- 쓰기를 전부 막으므로, 구성원 변경은 SQL 에디터나 service role 키로만 가능하다.
-- 관리자 세션이 탈취되더라도 관리자를 더 만들어낼 수 없게 하기 위함이다.
drop policy if exists "admin_users_admin_read" on public.admin_users;
create policy "admin_users_admin_read" on public.admin_users
  for select to authenticated using (public.is_admin());

revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;

-- ── 관리자 권한 부여 ─────────────────────────────────────────────────────────
-- 1. Supabase 대시보드에서 사용자를 만든다 (Authentication → Users → Add user).
--    회원가입이 열려 있다면 본인이 직접 가입해도 된다.
-- 2. 그 사용자의 이메일로 아래를 실행한다:
--
--    insert into public.admin_users (user_id, email, note)
--    select id, email, '연구실 관리자' from auth.users where email = 'someone@ulsan.ac.kr'
--    on conflict (user_id) do nothing;
--
-- 권한 회수는 이 테이블에서 삭제하면 된다. 해당 사용자의 다음 요청부터 적용되며,
-- 계정을 건드리거나 다른 사람의 세션에 영향을 주지 않는다.
