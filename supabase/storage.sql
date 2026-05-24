-- =====================================================================
-- Saigon FC Skill Hub - Supabase Storage setup cho avatar học viên
-- Chạy trong Supabase SQL Editor sau khi đã chạy schema.sql.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Tạo bucket "avatars" (public read, file size tối đa 5 MB)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880,  -- 5 MB
  array['image/jpeg','image/png','image/webp','image/gif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------
-- 2. Policies cho storage.objects: anon được upload/update/delete
--    trong bucket 'avatars'.
--    Public read tự động bật khi bucket.public = true.
-- ---------------------------------------------------------------------
drop policy if exists "avatars_anon_insert" on storage.objects;
create policy "avatars_anon_insert"
  on storage.objects for insert to anon
  with check (bucket_id = 'avatars');

drop policy if exists "avatars_anon_update" on storage.objects;
create policy "avatars_anon_update"
  on storage.objects for update to anon
  using (bucket_id = 'avatars')
  with check (bucket_id = 'avatars');

drop policy if exists "avatars_anon_delete" on storage.objects;
create policy "avatars_anon_delete"
  on storage.objects for delete to anon
  using (bucket_id = 'avatars');

-- Lưu ý bảo mật: anon hiện có quyền ghi đè / xóa mọi file trong bucket avatars.
-- Khi nâng cấp lên Supabase Auth, thay using/with check bằng:
--   bucket_id = 'avatars' and auth.role() = 'authenticated'
-- Hoặc giới hạn theo (storage.foldername(name))[1] = auth.uid()::text
