import type { Module } from '@/content/types';

const taxBack: Module = {
  id: 'tax-back',
  title: 'Tax you might be owed',
  subtitle: "Most PAYE workers are owed something. Here's how to find out.",
  durationMinutes: 5,
  steps: [
    {
      id: 'why-owed',
      label: 'Why Revenue might owe you money',
      body: "The Irish tax system is Pay As You Earn — your employer deducts tax from your wages before you see them. But PAYE is an estimate. At the end of the year, if too much was deducted, Revenue owes you the difference.\n\nThis happens more often than people realise.\n\nYou started a job partway through the year. Your employer calculated tax as if you'd earn that salary for the full year — but you didn't, so your tax credits weren't fully used.\n\nYou were put on emergency tax. If Revenue didn't have your details when you started, your employer applied the emergency rate — usually higher than what you actually owe.\n\nYou have credits you never claimed. The Rent Tax Credit, medical expenses, tuition fees, working from home — these reduce your tax bill, but only if you tell Revenue they apply to you.\n\nThe window: you can claim back up to four years. Anything from those years is still claimable.",
      callout: {
        kind: 'info',
        text: "This module covers what to look for and where to claim. It does not tell you what you're personally owed — for that you'll need to log into Revenue's MyAccount and review your situation directly.",
      },
    },
    {
      id: 'myaccount',
      label: 'Your starting point: Revenue MyAccount',
      body: "Everything you need is on Revenue's MyAccount at ros.ie/myaccount. To sign in you'll need your PPS number plus either MyGovID or your date of birth and a recent tax document.\n\nOnce you're in, you'll work through three sections:\n\nManage Your Tax — for the current year. This is where you add credits to your Tax Credit Certificate so they apply to future payslips.\n\nReview Your Tax — for previous years. This is where Revenue calculates whether you overpaid and produces a Statement of Liability. If you overpaid, the refund usually arrives in your bank account within 5 working days.\n\nReceipts Tracker — where you upload medical and other expense receipts. Revenue keeps these for six years and uses them when processing claims.\n\nThe Tax Credit Certificate is the key document to understand. It lists every credit Revenue thinks applies to you. If a credit is missing, that's where the underpayment started.",
      callout: {
        kind: 'tip',
        text: "Sign in to MyAccount before reading on. Each section below is easier to follow if you can see your own Tax Credit Certificate while you read.",
      },
    },
    {
      id: 'credits',
      label: "Credits you can claim (and probably haven't)",
      body: "A credit reduces your tax bill euro-for-euro. These are the ones most relevant to students, recent graduates, and PAYE workers in the first years of their career.\n\nPersonal Tax Credit — €1,875 in 2026. Every Irish-resident PAYE worker gets this. Applied automatically when Revenue has your details.\n\nEmployee Tax Credit — €1,875 in 2026. Applied automatically once your employer has registered you with Revenue.\n\nRent Tax Credit — applies to rent paid on private accommodation, including digs and rent-a-room arrangements. The amount depends on the year:\n— For 2024 onwards: 20% of rent paid, up to €1,000 if you're single\n— For 2022 and 2023: 20% of rent paid, up to €500 if you're single\n— Higher amounts apply for jointly assessed couples\n\nThis credit is not applied automatically. You have to claim it. The scheme has been extended to the end of 2028.\n\nTuition Fee Relief — 20% relief on qualifying tuition fees over a threshold. Available where you (or someone on your behalf) paid college fees not already covered by Free Fees.\n\nMedical expenses — 20% relief on qualifying healthcare costs. There is no minimum threshold. Includes GP and consultant fees, prescriptions, non-routine dental work, physiotherapy, and certain other healthcare. Routine eye tests and glasses do not qualify.\n\nWorking from home relief — covers electricity, heating, and broadband costs incurred while working from home, where your employer hasn't already made the daily payment. Claimed on the actual costs, not a flat rate.\n\nFlat-rate expenses — fixed deductions Revenue allows for certain professions: teachers, nurses, retail workers, lab technicians, and others. Check Revenue's list at revenue.ie under \"flat rate expenses\".",
      callout: {
        kind: 'info',
        text: "Don't try to memorise these. The point is knowing they exist — when you log into MyAccount, you'll see each one as an option you can add or review.",
      },
    },
    {
      id: 'making-claim',
      label: 'How to actually make the claim',
      body: "The process differs slightly depending on whether you're claiming for the current year or previous years.\n\nFor the current year (2026):\nSign in to MyAccount → Manage Your Tax → add any credits that apply. Revenue updates your Tax Credit Certificate and your employer applies the new credits from your next payslip. The benefit comes through reduced tax in future paydays, not as a lump sum.\n\nFor previous years (2022–2025):\nSign in to MyAccount → Review Your Tax → select the year. Revenue shows your existing position. Add any credits you missed (rent, medical, working from home, tuition fees) under each year separately — you can't combine years.\n\nWhen you submit, Revenue produces a Statement of Liability showing whether you overpaid or underpaid that year. If you overpaid, the refund goes to your bank account, usually within 5 working days.\n\nFor medical expenses specifically:\nTwo options. Either upload receipts to the Receipts Tracker as you go (real-time relief through reduced PAYE in your next payslip), or save them and claim everything at year-end through Review Your Tax. Both methods give the same total relief.\n\nFor non-routine dental work, your dentist completes a Med 2 form. You keep this for your records — Revenue may ask for it but you don't need to upload it unless requested.\n\nWhat you'll have ready:\n— PPS number\n— Bank account details (for the refund)\n— Landlord name and address (for rent credit)\n— Receipts for medical or tuition expenses (kept for six years)\n\nYou don't need an accountant. MyAccount is built for PAYE workers to do this themselves.",
      callout: {
        kind: 'tip',
        text: "Backdated claims are processed year by year, not in one go. If you have four years of unclaimed credits, that's four separate Statement of Liability submissions. Take them one at a time, starting with the oldest year — each takes about ten minutes once your records are ready.",
      },
    },
    {
      id: 'emergency-tax',
      label: "If you've been on emergency tax",
      body: "Emergency tax shows up on your payslip as either a flat 40% deduction or a flat 20% with no credits applied — both higher than what most people should actually pay.\n\nIt happens when Revenue doesn't have your tax details on file when you start a job. Your employer defaults to emergency rates until your Tax Credit Certificate arrives.\n\nTo fix it now:\n\n1. Sign in to Revenue MyAccount\n2. Check your Tax Credit Certificate — confirm your Personal Credit (€1,875) and Employee Credit (€1,875) are both listed\n3. If they're missing, add them under Manage Your Tax\n4. Revenue sends an updated certificate to your employer within a few days\n5. Your next payslip should correct the rate going forward\n\nGetting back what you overpaid:\nOnce your correct credits are applied, your employer recalculates tax for the year-to-date. The overpayment is credited back through your next payslip — you don't need to file a separate claim.\n\nIf you've left the job where you were on emergency tax and didn't fix it at the time, you can still claim the overpayment. Go to Review Your Tax for that year in MyAccount.",
      callout: {
        kind: 'warning',
        text: 'Emergency tax can quietly continue for months if no one flags it. Check your first three payslips of any new job to confirm your full credits are applied. Look for "Cumulative" rather than "Week 1" or "Emergency" on the payslip.',
      },
    },
  ],
  closingLine: 'Most PAYE workers are owed something. The only way to find out is to look.',
  lastReviewed: 'April 2026',
  reviewNote: 'Verified against Revenue.ie 2026 guidance and Citizens Information',
};

export default taxBack;
