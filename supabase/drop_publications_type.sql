-- 미사용 publications.type 제거 (Journal/Conference는 관리자·공개 UI 어디에도 쓰이지 않았다)
alter table public.publications drop column if exists type;
