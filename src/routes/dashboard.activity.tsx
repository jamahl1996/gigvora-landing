import { createFileRoute } from '@tanstack/react-router';
import DashboardActivityPage from '@/pages/dashboard/DashboardActivityPage';

export const Route = createFileRoute('/dashboard/activity')({
  head: () => ({ meta: [
    { title: 'Activity — Dashboard — Gigvora' },
    { name: 'description', content: 'All recent activity across your Gigvora workspace.' },
  ]}),
  component: () => <DashboardActivityPage />,
});