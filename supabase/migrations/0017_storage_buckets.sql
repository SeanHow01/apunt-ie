-- supabase/migrations/0017_storage_buckets.sql

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'saf-documents',
  'saf-documents',
  false,
  10485760,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
);

create policy "students upload own documents"
  on storage.objects for insert
  with check (
    bucket_id = 'saf-documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "students read own documents"
  on storage.objects for select
  using (
    bucket_id = 'saf-documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "staff read saf documents"
  on storage.objects for select
  using (
    bucket_id = 'saf-documents'
    and exists (
      select 1 from public.saf_staff_users
      where user_id = auth.uid()
    )
  );
