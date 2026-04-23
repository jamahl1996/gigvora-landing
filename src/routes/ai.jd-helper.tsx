import { createFileRoute } from '@tanstack/react-router';
import AIJDHelperPage from '@/pages/ai/AIJDHelperPage';
export const Route = createFileRoute('/ai/jd-helper')({
  head: () => ({ meta: [{ title: 'Job Description Helper — Gigvora AI' }, { name: 'description', content: 'AI-assisted job descriptions tuned for inclusive, high-conversion sourcing.' }]}),
  component: () => <AIJDHelperPage />,
});
