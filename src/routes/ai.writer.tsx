import { createFileRoute } from '@tanstack/react-router';
import AIWriterPage from '@/pages/ai/AIWriterPage';
export const Route = createFileRoute('/ai/writer')({
  head: () => ({ meta: [{ title: 'AI Writer — Gigvora' }, { name: 'description', content: 'Long-form AI writing assistant for proposals, posts, and outreach.' }]}),
  component: () => <AIWriterPage />,
});
