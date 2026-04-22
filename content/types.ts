export type StepHighlight = 'gross' | 'paye' | 'usc' | 'prsi' | 'net' | null;

export type CalloutKind = 'tip' | 'warning' | 'context';

export type LessonStep = {
  id: string;
  label: string;
  body: string;
  highlight?: StepHighlight;
  callout?: { kind: CalloutKind; text: string };
};

export type Module = {
  id: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  steps: LessonStep[];
  closingLine: string;
};
