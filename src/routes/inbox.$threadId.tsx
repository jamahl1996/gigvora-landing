import { createFileRoute } from '@tanstack/react-router';
import ThreadDetailPage from '@/pages/inbox/ThreadDetailPage';
export const Route = createFileRoute('/inbox/$threadId')({
  head: () => ({ meta: [{ title: 'Inbox — Gigvora' }, { name: 'description', content: 'Conversation thread.' }]}),
  component: () => <ThreadDetailPage />,
});
