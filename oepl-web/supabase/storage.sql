-- Storage buckets + policies
insert into storage.buckets (id, name, public)
values
  ('member-photos', 'member-photos', true),
  ('news-photos', 'news-photos', true),
  ('gallery-photos', 'gallery-photos', true),
  ('news-files', 'news-files', true)
on conflict (id) do update set public = true;

-- member-photos
drop policy if exists "member_photos_public_read" on storage.objects;
drop policy if exists "member_photos_authenticated_insert" on storage.objects;
drop policy if exists "member_photos_authenticated_update" on storage.objects;
drop policy if exists "member_photos_authenticated_delete" on storage.objects;
create policy "member_photos_public_read" on storage.objects for select using (bucket_id = 'member-photos');
create policy "member_photos_authenticated_insert" on storage.objects for insert to authenticated with check (bucket_id = 'member-photos');
create policy "member_photos_authenticated_update" on storage.objects for update to authenticated using (bucket_id = 'member-photos');
create policy "member_photos_authenticated_delete" on storage.objects for delete to authenticated using (bucket_id = 'member-photos');

-- news-photos
drop policy if exists "news_photos_storage_public_read" on storage.objects;
drop policy if exists "news_photos_storage_authenticated_insert" on storage.objects;
drop policy if exists "news_photos_storage_authenticated_update" on storage.objects;
drop policy if exists "news_photos_storage_authenticated_delete" on storage.objects;
create policy "news_photos_storage_public_read" on storage.objects for select using (bucket_id = 'news-photos');
create policy "news_photos_storage_authenticated_insert" on storage.objects for insert to authenticated with check (bucket_id = 'news-photos');
create policy "news_photos_storage_authenticated_update" on storage.objects for update to authenticated using (bucket_id = 'news-photos');
create policy "news_photos_storage_authenticated_delete" on storage.objects for delete to authenticated using (bucket_id = 'news-photos');

-- gallery-photos
drop policy if exists "gallery_photos_storage_public_read" on storage.objects;
drop policy if exists "gallery_photos_storage_authenticated_insert" on storage.objects;
drop policy if exists "gallery_photos_storage_authenticated_update" on storage.objects;
drop policy if exists "gallery_photos_storage_authenticated_delete" on storage.objects;
create policy "gallery_photos_storage_public_read" on storage.objects for select using (bucket_id = 'gallery-photos');
create policy "gallery_photos_storage_authenticated_insert" on storage.objects for insert to authenticated with check (bucket_id = 'gallery-photos');
create policy "gallery_photos_storage_authenticated_update" on storage.objects for update to authenticated using (bucket_id = 'gallery-photos');
create policy "gallery_photos_storage_authenticated_delete" on storage.objects for delete to authenticated using (bucket_id = 'gallery-photos');

-- news-files
drop policy if exists "news_files_storage_public_read" on storage.objects;
drop policy if exists "news_files_storage_authenticated_insert" on storage.objects;
drop policy if exists "news_files_storage_authenticated_update" on storage.objects;
drop policy if exists "news_files_storage_authenticated_delete" on storage.objects;
drop policy if exists "news_attachments_storage_public_read" on storage.objects;
drop policy if exists "news_attachments_storage_authenticated_insert" on storage.objects;
drop policy if exists "news_attachments_storage_authenticated_update" on storage.objects;
drop policy if exists "news_attachments_storage_authenticated_delete" on storage.objects;
create policy "news_files_storage_public_read" on storage.objects for select using (bucket_id = 'news-files');
create policy "news_files_storage_authenticated_insert" on storage.objects for insert to authenticated with check (bucket_id = 'news-files');
create policy "news_files_storage_authenticated_update" on storage.objects for update to authenticated using (bucket_id = 'news-files');
create policy "news_files_storage_authenticated_delete" on storage.objects for delete to authenticated using (bucket_id = 'news-files');
