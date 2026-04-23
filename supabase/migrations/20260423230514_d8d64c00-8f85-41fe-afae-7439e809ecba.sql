-- Replace broad public read with per-object read (allows direct URL fetches, blocks LIST)
drop policy if exists "Avatar images are publicly accessible" on storage.objects;
drop policy if exists "Post media public read" on storage.objects;
drop policy if exists "Gig media public read" on storage.objects;

create policy "Avatars per-object read" on storage.objects for select
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] is not null);
create policy "Post media per-object read" on storage.objects for select
  using (bucket_id = 'post-media' and (storage.foldername(name))[1] is not null);
create policy "Gig media per-object read" on storage.objects for select
  using (bucket_id = 'gig-media' and (storage.foldername(name))[1] is not null);
