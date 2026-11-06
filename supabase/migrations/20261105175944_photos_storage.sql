-- Photo uploads on Supabase Storage (decided with Adel, 5 Nov 2026, instead of R2).
-- The browser shrinks every photo (≈1600 px, WebP/JPEG) before uploading.
--   submission-photos (private): the seller's photos for a sell request.
--       path {seller id}/{submission id}/{file}; the seller and the admins read them.
--   device-photos (public): the listing's photos (seller photos copied on accept,
--       then the official ones). Anyone can view; only admins add / remove.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('submission-photos', 'submission-photos', false, 3145728, array['image/jpeg', 'image/png', 'image/webp']),
  ('device-photos', 'device-photos', true, 3145728, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "submission photos: seller uploads to own folder" on storage.objects for insert to authenticated
  with check (bucket_id = 'submission-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "submission photos: seller and admins read" on storage.objects for select to authenticated
  using (bucket_id = 'submission-photos' and ((storage.foldername(name))[1] = (select auth.uid())::text or (select private.is_admin())));
create policy "submission photos: admins delete" on storage.objects for delete to authenticated
  using (bucket_id = 'submission-photos' and (select private.is_admin()));

create policy "device photos: admins upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'device-photos' and (select private.is_admin()));
create policy "device photos: admins update" on storage.objects for update to authenticated
  using (bucket_id = 'device-photos' and (select private.is_admin()));
create policy "device photos: admins delete" on storage.objects for delete to authenticated
  using (bucket_id = 'device-photos' and (select private.is_admin()));
create policy "device photos: admins list" on storage.objects for select to authenticated
  using (bucket_id = 'device-photos' and (select private.is_admin()));

-- The media tables' "r2_key" column now holds the Storage path.
comment on column public.submission_media.r2_key is 'Storage path in bucket submission-photos';
comment on column public.device_media.r2_key is 'Storage path in bucket device-photos';
