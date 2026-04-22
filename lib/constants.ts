/** Legal disclaimer appended to every article by the rendering layer. */
export const ARTICLE_DISCLAIMER =
  'Educational content only. Not financial advice. For personal financial advice, contact MABS (mabs.ie) or an authorised financial advisor.';

/** Article categories for dropdowns and filters. */
export const ARTICLE_CATEGORIES = [
  { value: 'banking', label: 'Banking' },
  { value: 'pensions', label: 'Pensions' },
  { value: 'tax', label: 'Tax' },
  { value: 'housing', label: 'Housing' },
  { value: 'investing', label: 'Investing' },
  { value: 'benefits', label: 'Benefits' },
  { value: 'general', label: 'General' },
] as const;

export type ArticleCategory = typeof ARTICLE_CATEGORIES[number]['value'];

/** Article types. */
export const ARTICLE_TYPES = [
  { value: 'news', label: 'News' },
  { value: 'explainer', label: 'Explainer' },
  { value: 'news_and_explainer', label: 'News & Explainer' },
] as const;

export type ArticleType = typeof ARTICLE_TYPES[number]['value'];

/** Module IDs for related-modules multi-select in the admin editor. */
export const MODULE_OPTIONS = [
  { id: 'payslip', title: 'Understanding your payslip' },
  { id: 'auto-enrolment', title: 'Auto-enrolment' },
  { id: 'loans', title: 'Before you sign — loans' },
  { id: 'rent', title: 'Renting in Ireland' },
  { id: 'help-to-buy', title: 'Help to Buy' },
  { id: 'susi', title: 'SUSI grant' },
  { id: 'investing', title: 'Your first €50 invested' },
] as const;

/** Words per minute for reading time estimation. */
export const READING_WPM = 200;
