import { redirect } from 'next/navigation';

/** /tools → redirect to the first tool so the URL never 404s */
export default function ToolsIndex() {
  redirect('/tools/loan-calculator');
}
