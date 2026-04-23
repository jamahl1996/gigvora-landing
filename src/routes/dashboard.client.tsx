import { createFileRoute } from '@tanstack/react-router';
import ClientDashboardPage from '@/pages/dashboard/ClientDashboardPage';

export const Route = createFileRoute('/dashboard/client')({
  head: () => ({ meta: [
    { title: 'Client Dashboard — Gigvora' },
    { name: 'description', content: 'Manage projects, hires, spend, and approvals as a client on Gigvora.' },
  ]}),
  component: () => <ClientDashboardPage />,
});
