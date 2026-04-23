import { createFileRoute } from '@tanstack/react-router';
import AIBriefHelperPage from '@/pages/ai/AIBriefHelperPage';
export const Route = createFileRoute('/ai/brief-helper')({
  head: () => ({ meta: [{ title: 'Brief Helper — Gigvora AI' }, { name: 'description', content: 'AI assistant for writing project briefs that attract the right talent.' }]}),
  component: () => <AIBriefHelperPage />,
});
