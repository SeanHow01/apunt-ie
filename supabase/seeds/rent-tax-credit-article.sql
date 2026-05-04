-- Seed: Rent Tax Credit article
-- Run this in the Supabase SQL Editor to publish the article.
-- Alternatively, paste the content into the admin CMS at /admin/news/new.
--
-- Requires: your admin profile must have role = 'admin'
-- (set via: update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'YOUR_EMAIL'))

insert into public.articles (
  slug,
  title,
  summary,
  content_md,
  category,
  article_type,
  related_module_ids,
  sources,
  status,
  reading_minutes,
  published_at
) values (
  'rent-tax-credit-how-to-claim',
  'The Rent Tax Credit: how to claim back up to €1,000 — and why it''s not automatic',
  'The Rent Tax Credit has been extended to 2028 and is worth up to €1,000 a year for single renters. Most people who qualify haven''t claimed all the years they''re entitled to. Here''s how it works.',
  $content$The Rent Tax Credit has been one of the more quietly important pieces of recent Irish tax policy. Introduced in 2022, increased twice since, and now extended to the end of 2028 in Budget 2026, it''s worth up to €1,000 per year for single renters and €2,000 for jointly assessed couples.

Most renters who qualify have either claimed it incompletely or not at all.

## Who can claim it

The credit applies to rent you paid on private rented accommodation in Ireland, including digs and rent-a-room arrangements where you share with the property owner. It includes student accommodation. It also covers rent paid by parents on behalf of a child in college, if the child is under 23 at the start of the year they begin the course.

You cannot claim it if your tenancy is supported by HAP or other state housing assistance — even if you''re paying a top-up.

For most rentals, the tenancy must be registered with the Residential Tenancies Board. Rent-a-room arrangements with the owner of the house don''t need to be registered to qualify.

## How much is it actually worth

The credit is calculated as 20% of the rent you paid in the year, up to a maximum that depends on the year:

For 2022 and 2023: up to €500 a year for single people, €1,000 for jointly assessed couples.

For 2024 to 2028: up to €1,000 a year for single people, €2,000 for jointly assessed couples.

If you''ve been renting privately for the full four years and never claimed, the maximum is approximately €3,000 across all four years for a single person — assuming you paid enough income tax to use the credits in full.

The credit only reduces your income tax bill. It cannot reduce your USC or PRSI, and you can only claim up to the amount of income tax you actually paid that year.

## Why it''s not automatic

Most tax credits in Ireland are applied automatically — your Tax Credit Certificate is set up by Revenue and your employer applies the credits to every payslip. The Rent Tax Credit doesn''t work that way.

You have to claim it manually, and you have to claim each year separately. Revenue has no way of knowing where you live or whether you''re paying rent unless you tell them.

This is the main reason so many renters miss it.

## How to claim

Sign in to Revenue MyAccount at ros.ie/myaccount.

For the current year, go to Manage Your Tax. Add the Rent Tax Credit. Revenue updates your Tax Credit Certificate and your employer applies the relief from your next payslip.

For previous years, go to Review Your Tax. Select the year. Add the Rent Tax Credit. Revenue produces a Statement of Liability for that year. If you overpaid tax, the refund goes to your bank account, usually within 5 working days.

You''ll need: your landlord''s name, the property address, and the amount of rent you paid in that year.

You don''t need to upload receipts when making the claim, but Revenue may ask for confirmation later, so keep your records for six years.

## What to check before you start

The tenancy must be registered with the RTB unless it''s a rent-a-room arrangement. If your landlord hasn''t registered, you can ask them to. You can also check the RTB register at rtb.ie.

The accommodation must be your principal private residence, your in-college residence, or accommodation you use for work or study at a distance from home.

If you live in social housing, HAP-supported accommodation, or another state-assisted arrangement, the credit doesn''t apply.

## The four-year window

You can claim back tax credits for up to four years. Anything from 2022 onwards is still claimable now. After 2026 ends, the 2022 year becomes uncollectable. Worth noting for anyone who''s been renting without claiming.

The Punt refund checker can help you work out which credits to look for, and the tax module covers the full process from start to finish. But the only way to know what you''re personally owed is to sign in to MyAccount and review.

This article is for educational purposes. For advice on your own situation, contact Revenue or speak to a qualified tax advisor.$content$,
  'tax',
  'explainer',
  array['tax-back'],
  '[{"name": "Revenue.ie", "url": "https://www.revenue.ie/en/personal-tax-credits-reliefs-and-exemptions/rent-and-housing/rent-tax-credit/index.aspx"}, {"name": "Citizens Information", "url": "https://www.citizensinformation.ie/en/housing/renting-a-home/help-with-renting/rent-tax-credit/"}]'::jsonb,
  'published',
  4,
  now()
)
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  content_md = excluded.content_md,
  category = excluded.category,
  article_type = excluded.article_type,
  related_module_ids = excluded.related_module_ids,
  sources = excluded.sources,
  status = excluded.status,
  reading_minutes = excluded.reading_minutes,
  published_at = excluded.published_at,
  updated_at = now();
