import { createFileRoute } from '@tanstack/react-router';
import AIHistoryPage from '@/pages/ai/AIHistoryPage';
export const Route = createFileRoute('/ai/history')({
  head: () => ({ meta: [{ title: 'AI History — Gigvora' }, { name: 'description', content: 'Your full AI conversation and generation history.' }]}),
  component: () => <AIHistoryPage />,
});
