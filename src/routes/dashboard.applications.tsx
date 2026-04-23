import { createFileRoute } from '@tanstack/react-router';
import DashboardApplicationsPage from '@/pages/dashboard/DashboardApplicationsPage';

export const Route = createFileRoute('/dashboard/applications')({
  head: () => ({ meta: [
    { title: 'Applications — Dashboard — Gigvora' },
    { name: 'description', content: 'Track every job and project application from one place.' },
  ]}),
  component: () => <DashboardApplicationsPage />,
});