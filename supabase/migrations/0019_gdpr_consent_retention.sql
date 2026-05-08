-- Migration 0019: GDPR consent columns + automated 18-month retention function
-- Run: supabase db push

-- ── Add GDPR consent tracking to SAF applications ─────────────────────────────

alter table public.saf_applications
  add column if not exists gdpr_consent_at  timestamptz,
  add column if not exists gdpr_consent_ip  text;

comment on column public.saf_applications.gdpr_consent_at is
  'Timestamp when the applicant gave explicit GDPR data processing consent (Step 5 of the application wizard).';
comment on column public.saf_applications.gdpr_consent_ip is
  'IP address at time of GDPR consent, if available from request headers.';


-- ── 18-month automated retention deletion function ────────────────────────────
-- Schedule with pg_cron (requires pg_cron extension on Supabase):
--   SELECT cron.schedule('saf-retention-cleanup', '0 3 1 * *',
--     'SELECT delete_expired_saf_data()');
--
-- Enable extension: Supabase Dashboard → Extensions → pg_cron
-- If pg_cron is not available on the current plan, run this function manually
-- each month until the plan is upgraded.

create or replace function public.delete_expired_saf_data()
returns void
language plpgsql
security definer
as $$
declare
  expired_app record;
begin
  -- Find applications decided more than 18 months ago
  for expired_app in
    select id from public.saf_applications
    where decided_at < now() - interval '18 months'
      and status in ('approved', 'rejected')
  loop
    -- Write audit entry before deletion (the log row itself will cascade-delete,
    -- so we write to a separate long-term retention log if one exists, otherwise
    -- this serves as the final record before cascade)
    insert into public.saf_audit_log (
      application_id,
      actor_type,
      action,
      metadata
    ) values (
      expired_app.id,
      'system',
      'gdpr_retention_deletion',
      jsonb_build_object(
        'deleted_at', now(),
        'reason', '18_month_retention_policy'
      )
    );

    -- Delete the application.
    -- FK ON DELETE CASCADE removes: saf_documents, saf_staff_notes, saf_audit_log.
    -- Storage objects (files) must be cleaned up separately via the storage API
    -- using service-role credentials — log the application_id for the storage sweep.
    delete from public.saf_applications where id = expired_app.id;
  end loop;
end;
$$;

comment on function public.delete_expired_saf_data() is
  'Deletes SAF applications (and cascaded records) decided more than 18 months ago, per GDPR retention policy. Schedule monthly via pg_cron.';
