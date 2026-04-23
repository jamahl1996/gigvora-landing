import { createFileRoute } from '@tanstack/react-router';
import DashboardProjectsPage from '@/pages/dashboard/DashboardProjectsPage';

export const Route = createFileRoute('/dashboard/projects')({
  head: () => ({ meta: [
    { title: 'Projects — Dashboard — Gigvora' },
    { name: 'description', content: 'All projects across your Gigvora workspace.' },
  ]}),
  component: () => <DashboardProjectsPage />,
});