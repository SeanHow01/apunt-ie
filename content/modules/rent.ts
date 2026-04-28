import type { Module } from '@/content/types';

const rent: Module = {
  id: 'rent',
  title: 'Renting in Ireland, plainly',
  subtitle: 'Deposits, leases, notice periods, and your rights.',
  durationMinutes: 6,
  steps: [
    {
      id: 'the-lease',
      label: 'The lease',
      body: 'A lease is a legal contract between you and your landlord. It can be fixed-term (usually 12 months) or periodic. Under Part 4 of the Residential Tenancies Act, if you stay in a property for six months, you gain the right to remain there for up to six years — regardless of what your fixed-term lease says. A lease must include the names of both parties, the rent amount, the payment terms, and the duration.',
    },
    {
      id: 'the-deposit',
      label: 'The deposit',
      body: "A deposit is typically one month's rent. Your landlord must register the tenancy with the Residential Tenancies Board (RTB). The RTB deposit protection scheme means disputes about deposits can be resolved through their free dispute resolution service. Your deposit must be returned within a reasonable time after the tenancy ends, minus any legitimate deductions for damage beyond normal wear and tear.",
      callout: {
        kind: 'tip',
        text: 'Photograph every room thoroughly on the day you move in. Share the photos with your landlord by email so there is a dated record. This protects you when the time comes to get your deposit back.',
      },
    },
    {
      id: 'rent-and-increases',
      label: 'Rent and increases',
      body: "In a Rent Pressure Zone (RPZ) — most cities and many towns — rent increases are capped at 2% per year (or the rate of inflation if lower). Your landlord must give you 90 days' written notice of any rent increase, and must provide evidence that the new rent is in line with similar local properties. You can check whether your area is an RPZ on the RTB website.",
    },
    {
      id: 'notice-periods',
      label: 'Notice periods',
      body: "Both you and your landlord must give notice to end a tenancy. For the first six months, a landlord can end the tenancy for any reason with 28 days' notice. After six months, the grounds become restricted — the landlord can only end a tenancy for specific reasons (selling the property, needing it for family use, planning substantial renovation). Notice periods increase with the length of the tenancy, reaching 224 days after eight or more years.",
    },
    {
      id: 'landlord-rights-and-obligations',
      label: 'What a landlord can and cannot do',
      body: "A landlord cannot enter the property without giving you at least 24 hours' notice, except in emergencies. They must provide a rent book or written receipts, keep the structure and exterior of the property in good repair, and register the tenancy with the RTB. A landlord cannot cut off your utilities, change your locks without notice, or take retaliatory action if you report a problem. These are legal obligations, not optional.",
    },
    {
      id: 'when-there-is-a-problem',
      label: "When there's a problem",
      body: 'If there is a dispute with your landlord, the RTB offers a free mediation and adjudication service. Threshold is a housing charity that provides free advice to tenants. Citizens Information and FLAC (Free Legal Advice Centres) can also help. If you are in receipt of housing support, HAP (Housing Assistance Payment) is administered through your local council — contact them directly for eligibility.',
    },
    {
      id: 'before-you-sign',
      label: 'Before you sign',
      body: 'Before signing a lease, confirm the tenancy is registered with the RTB (you can search the RTB register online). Read the entire lease — particularly the break clause, the rules on subletting, and what counts as damage. Ask your landlord about the deposit return process in writing. Photograph every room on the day you move in. Keep a copy of the signed lease somewhere you can access it easily.',
    },
  ],
  closingLine: 'A tenancy is a contract. Read it before you sign, and keep a copy of everything.',
  lastReviewed: 'April 2026',
  reviewNote: 'RTB rules, 90-day notice periods, and deposit rules verified against current tenancy legislation.',
};

export default rent;
