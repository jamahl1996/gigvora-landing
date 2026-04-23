import { createFileRoute } from '@tanstack/react-router';
import DashboardSavedPage from '@/pages/dashboard/DashboardSavedPage';

export const Route = createFileRoute('/dashboard/saved')({
  head: () => ({ meta: [
    { title: 'Saved — Dashboard — Gigvora' },
    { name: 'description', content: 'Saved gigs, services, jobs, projects, and posts.' },
  ]}),
  component: () => <DashboardSavedPage />,
});