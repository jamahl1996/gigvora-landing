import { createFileRoute } from '@tanstack/react-router';
import UserDashboardPage from '@/pages/dashboard/UserDashboardPage';

export const Route = createFileRoute('/dashboard')({
  head: () => ({ meta: [
    { title: 'Dashboard — Gigvora' },
    { name: 'description', content: 'Your personal command center across Gigvora.' },
  ]}),
  component: () => <UserDashboardPage />,
});