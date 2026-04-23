import { createFileRoute } from '@tanstack/react-router';
import NetworkPage from '@/pages/NetworkPage';

export const Route = createFileRoute('/network')({
  head: () => ({ meta: [
    { title: 'Network — Gigvora' },
    { name: 'description', content: 'Your connections, follow-ups, and relationship pipeline on Gigvora.' },
  ]}),
  component: () => <NetworkPage />,
});