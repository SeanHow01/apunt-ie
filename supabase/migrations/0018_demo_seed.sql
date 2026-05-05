-- supabase/migrations/0018_demo_seed.sql
-- Run AFTER creating both demo auth accounts manually.
-- Replace STAFF_USER_ID and STUDENT_USER_ID with actual auth.users UUIDs.

-- Staff user record
insert into public.saf_staff_users (user_id, institution, role, display_name)
values ('STAFF_USER_ID', 'SETU', 'committee', 'Mary O''Brien — Student Services');

-- Application 1: Submitted
insert into public.saf_applications (
  reference_number, user_id, institution, campus, course, year_of_study, study_type,
  status, reason_category, circumstances, amount_requested,
  monthly_income, monthly_expenses, bank_name, iban_last_four, submitted_at
) values (
  'SAF-2026-00001', 'STUDENT_USER_ID', 'SETU', 'Waterford — Main', 'BSc Business', '2nd Year', 'full_time',
  'submitted', 'loss_of_employment',
  'I was working 15 hours per week at SuperValu on the Quay but lost my position in early October when the store reduced staff hours. I have been unable to find alternative work and my savings are now fully depleted. I cannot cover my rent of €650 per month and basic living costs on my SUSI grant alone.',
  500.00,
  '{"susi": 508, "part_time": 0, "family": 150, "other": 0}',
  '{"rent": 650, "food": 180, "transport": 45, "childcare": 0, "other": 80}',
  'AIB', '5678', now() - interval '3 days'
);

-- Application 2: Under review
insert into public.saf_applications (
  reference_number, user_id, institution, campus, course, year_of_study, study_type,
  status, reason_category, circumstances, amount_requested,
  monthly_income, monthly_expenses, bank_name, iban_last_four, submitted_at
) values (
  'SAF-2026-00002', 'STUDENT_USER_ID', 'SETU', 'Waterford — Main', 'BEng Civil Engineering', '3rd Year', 'full_time',
  'under_review', 'accommodation_costs',
  'My landlord issued a rent increase notice in September, increasing my rent from €600 to €780 per month with one month notice. I was unable to find alternative accommodation within that time.',
  800.00,
  '{"susi": 508, "part_time": 200, "family": 0, "other": 0}',
  '{"rent": 780, "food": 200, "transport": 60, "childcare": 0, "other": 100}',
  'Bank of Ireland', '2341', now() - interval '8 days'
);

-- Application 3: Approved
insert into public.saf_applications (
  reference_number, user_id, institution, campus, course, year_of_study, study_type,
  status, reason_category, circumstances, amount_requested, amount_awarded,
  monthly_income, monthly_expenses, bank_name, iban_last_four,
  submitted_at, decided_at
) values (
  'SAF-2026-00003', 'STUDENT_USER_ID', 'SETU', 'Waterford — Main', 'BA Social Care', '2nd Year', 'full_time',
  'approved', 'bereavement',
  'My father passed away in September. I had to travel home to Kerry for two weeks and missed placement hours. I also incurred unexpected funeral travel costs of approximately €340.',
  350.00, 300.00,
  '{"susi": 508, "part_time": 180, "family": 0, "other": 0}',
  '{"rent": 580, "food": 160, "transport": 120, "childcare": 0, "other": 60}',
  'Revolut', '9012',
  now() - interval '15 days', now() - interval '5 days'
);

-- Application 4: Rejected
insert into public.saf_applications (
  reference_number, user_id, institution, campus, course, year_of_study, study_type,
  status, reason_category, circumstances, amount_requested,
  monthly_income, monthly_expenses, bank_name, iban_last_four,
  submitted_at, decided_at
) values (
  'SAF-2026-00004', 'STUDENT_USER_ID', 'SETU', 'Waterford — Main', 'BSc Computing', '1st Year', 'full_time',
  'rejected', 'course_costs',
  'I need a new laptop for my course. My current laptop is slow and I am struggling to complete assignments on time.',
  800.00,
  '{"susi": 300, "part_time": 350, "family": 200, "other": 0}',
  '{"rent": 0, "food": 100, "transport": 30, "childcare": 0, "other": 80}',
  'AIB', '3344',
  now() - interval '20 days', now() - interval '10 days'
);

-- Application 5: Awaiting info
insert into public.saf_applications (
  reference_number, user_id, institution, campus, course, year_of_study, study_type,
  status, reason_category, circumstances, amount_requested,
  monthly_income, monthly_expenses, bank_name, iban_last_four,
  submitted_at, info_requested_at, info_requested_note
) values (
  'SAF-2026-00005', 'STUDENT_USER_ID', 'SETU', 'Carlow', 'BA Early Childhood Care', '3rd Year', 'full_time',
  'awaiting_info', 'family_income_drop',
  'My parent lost their job in August and we have been managing on one income since. My SUSI was assessed on last year''s income so does not reflect our current situation.',
  1200.00,
  '{"susi": 508, "part_time": 0, "family": 0, "other": 0}',
  '{"rent": 620, "food": 180, "transport": 95, "childcare": 0, "other": 120}',
  'Credit Union', '7890',
  now() - interval '12 days', now() - interval '4 days',
  'Please upload a letter from the Department of Social Protection confirming your parent''s job seeker payment, or a P45 from their previous employer.'
);

-- Audit log entries
insert into public.saf_audit_log (application_id, actor_type, action, from_status, to_status)
select id, 'student', 'application_submitted', 'draft', 'submitted'
from public.saf_applications where reference_number = 'SAF-2026-00001';

insert into public.saf_audit_log (application_id, actor_type, action, from_status, to_status)
select id, 'staff', 'status_changed', 'submitted', 'under_review'
from public.saf_applications where reference_number = 'SAF-2026-00002';

insert into public.saf_audit_log (application_id, actor_type, action, from_status, to_status)
select id, 'staff', 'application_approved', 'under_review', 'approved'
from public.saf_applications where reference_number = 'SAF-2026-00003';

insert into public.saf_audit_log (application_id, actor_type, action, from_status, to_status)
select id, 'staff', 'application_rejected', 'under_review', 'rejected'
from public.saf_applications where reference_number = 'SAF-2026-00004';

insert into public.saf_audit_log (application_id, actor_type, action, from_status, to_status)
select id, 'staff', 'info_requested', 'submitted', 'awaiting_info'
from public.saf_applications where reference_number = 'SAF-2026-00005';
