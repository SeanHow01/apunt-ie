export type SetuCalendarEvent = {
  month: number
  date: string
  kind: string
  title: string
  fund: string | null
  urgent: boolean
  desc: string
  link: string | null
  approximate: boolean
}

export const SETU_CALENDAR_EVENTS: SetuCalendarEvent[] = [
  { month: 8,  date: 'Aug',     kind: 'SETU', title: 'Welcome Week preparation',             fund: null,                   urgent: false, desc: 'SETU Welcome Week runs in early September. Register with Punt before term starts.', link: null, approximate: true },
  { month: 9,  date: 'Sep',     kind: 'SETU', title: 'SETU Welcome Week',                   fund: 'Access / HEAR',        urgent: false, desc: 'Student Services and Access Office run financial briefings. HEAR students receive Access Office induction this week.', link: null, approximate: true },
  { month: 9,  date: 'Sep',     kind: 'SETU', title: 'Sports Bursary — applications open',  fund: 'Sports Bursary',       urgent: false, desc: 'The SETU Sports Scholarship programme opens for Waterford and Carlow campuses.', link: 'https://www.setu.ie/current-students/clubs-and-societies/sport-scholarships/sports-scholarships-waterford-campus', approximate: true },
  { month: 9,  date: 'Sep',     kind: 'SETU', title: '1916 Bursary — applications open',    fund: '1916 Bursary',         urgent: false, desc: 'Opens each September for students entering higher education the following year. Tiers 1–3 worth €1,500–€5,000/year. Apply at 1916bursary.ie.', link: 'https://www.1916bursary.ie', approximate: true },
  { month: 10, date: 'Oct',     kind: 'SETU', title: 'Student Assistance Fund opens',       fund: 'SAF',                  urgent: true,  desc: 'The SAF opens in October. It runs on a first-come-first-served basis — apply as soon as you have your documents. The fund closes when exhausted or in late February.', link: '/setu/saf', approximate: true },
  { month: 10, date: '17 Oct',  kind: 'SETU', title: 'Accommodation Assistance — deadline', fund: 'Accommodation',        urgent: true,  desc: 'Applications for accommodation assistance for Traveller, Roma and care-experienced students must be submitted by this date.', link: null, approximate: false },
  { month: 10, date: 'Oct',     kind: 'SETU', title: 'HEAR Access induction',               fund: 'HEAR',                 urgent: false, desc: 'HEAR-eligible students receive their Access Office induction this month, including priority SAF access.', link: null, approximate: true },
  { month: 11, date: 'Nov',     kind: 'SETU', title: 'Check SAF fund levels',               fund: 'SAF',                  urgent: true,  desc: 'The SAF is first-come-first-served and typically depletes before February. If you need support, apply now.', link: '/setu/saf', approximate: true },
  { month: 1,  date: 'Jan',     kind: 'SETU', title: 'Part-time SAF opens',                 fund: 'SAF',                  urgent: false, desc: 'Part-time students can apply for SAF support from January. Apply as soon as it opens — the fund is limited.', link: '/setu/saf', approximate: true },
  { month: 2,  date: 'Mid-Feb', kind: 'SETU', title: 'Part-time SAF closes',                fund: 'SAF',                  urgent: true,  desc: 'The part-time SAF round closes, usually around 9–14 February.', link: '/setu/saf', approximate: true },
  { month: 2,  date: '27 Feb',  kind: 'SETU', title: 'Full-time SAF closes',                fund: 'SAF',                  urgent: true,  desc: 'The full-time SAF closes on 27 February or when the fund is exhausted — whichever comes first.', link: '/setu/saf', approximate: false },
  { month: 3,  date: 'Mar',     kind: 'SETU', title: 'Sports Bursary — deadline',           fund: 'Sports Bursary',       urgent: false, desc: 'Confirm exact deadline with the SETU Sports Clubs & Societies Office. Typically closes in early-to-mid March.', link: 'https://www.setu.ie/current-students/clubs-and-societies/sport-scholarships/sports-scholarships-waterford-campus', approximate: true },
]

export function getSetuEventsForMonth(month: number): SetuCalendarEvent[] {
  return SETU_CALENDAR_EVENTS.filter(e => e.month === month)
}
