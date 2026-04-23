import { createFileRoute } from '@tanstack/react-router';
import NotificationsPage from '@/pages/NotificationsPage';

export const Route = createFileRoute('/notifications')({
  head: () => ({ meta: [
    { title: 'Notifications — Gigvora' },
    { name: 'description', content: 'All updates and alerts across your Gigvora workspace.' },
  ]}),
  component: () => <NotificationsPage />,
});