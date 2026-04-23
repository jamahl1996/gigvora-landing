import { createFileRoute } from '@tanstack/react-router';
import InboxPage from '@/pages/InboxPage';

export const Route = createFileRoute('/inbox')({
  head: () => ({ meta: [
    { title: 'Inbox — Gigvora' },
    { name: 'description', content: 'Messages, threads, and conversations across your Gigvora network.' },
  ]}),
  component: () => <InboxPage />,
});