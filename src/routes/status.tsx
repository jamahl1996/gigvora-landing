import { createFileRoute } from '@tanstack/react-router';
import StatusPage from '@/pages/StatusPage';

export const Route = createFileRoute('/status')({
  head: () => ({
    meta: [
      { title: 'System Status — Gigvora' },
      { name: 'description', content: 'Real-time health and 90-day uptime for Gigvora services — auth, search, payments, messaging, and more.' },
      { property: 'og:title', content: 'Gigvora System Status' },
      { property: 'og:description', content: 'Real-time health monitoring of the Gigvora platform.' },
    ],
  }),
  component: () => <StatusPage />,
});