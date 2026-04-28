import type { Module } from '@/content/types';

const susi: Module = {
  id: 'susi',
  title: 'SUSI grants, without the headache',
  subtitle: 'The student grant — who qualifies, what it covers, how to apply.',
  durationMinutes: 4,
  steps: [
    {
      id: 'what-susi-is',
      label: 'What SUSI is',
      body: 'Student Universal Support Ireland (SUSI) is the single national body that processes all student grant applications in Ireland. It is funded by the state and administered through SUSI.ie. Grants can cover two things: the student contribution (the annual fee charged by colleges, currently around €3,000) and a maintenance grant to help with living costs. Not every student who qualifies receives both.',
    },
    {
      id: 'two-types',
      label: 'The two types of grant',
      body: 'A fee/contribution grant covers some or all of the student contribution fee. A maintenance grant is a cash payment toward living costs — the amount depends on household income and how far you live from your college. Some students receive both; others receive only one. The distinction matters: a student who commutes may receive less maintenance support than one who lives away from home.',
    },
    {
      id: 'who-qualifies',
      label: 'Who qualifies',
      body: 'Eligibility is based on reckonable household income from the previous tax year, the course you are enrolled on, and whether you are ordinarily resident in Ireland. Income thresholds vary by family size — a single-parent household has a different threshold than a two-parent household with multiple dependants. Your course must be a qualifying undergraduate or postgraduate programme at an approved institution.',
      callout: {
        kind: 'context',
        text: 'Income thresholds and exact grant amounts change each year. Check susi.ie for current figures before you apply — the numbers in any third-party summary may be out of date.',
      },
    },
    {
      id: 'how-to-apply',
      label: 'How to apply',
      body: 'Applications open each spring — usually in April — on SUSI.ie. Apply as early as possible: late applications are processed later, and grant payments can be delayed if documentation is missing. You will need proof of income (P21 or Revenue notice of assessment), proof of enrolment, and PPS numbers for all household members. Processing typically takes several weeks.',
    },
    {
      id: 'if-refused',
      label: "If you're refused",
      body: 'If your application is refused, you have the right to appeal. Common reasons for refusal include incomplete documentation, income slightly above the threshold, or not meeting the residency requirement. SUSI will tell you the reason in writing. You can appeal directly through SUSI.ie, and if that fails, there is a further independent appeals process. Citizens Information can advise on both routes.',
    },
  ],
  closingLine: "SUSI opens each spring. If there's any chance you qualify, apply — the deadline passes quickly.",
  lastReviewed: 'April 2026',
  reviewNote: '2025/26 grant year — household income thresholds, adjacent/non-adjacent amounts, and contribution rates verified.',
};

export default susi;
