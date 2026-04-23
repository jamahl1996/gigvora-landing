import { createFileRoute } from '@tanstack/react-router';
import DashboardSupportPage from '@/pages/dashboard/DashboardSupportPage';

export const Route = createFileRoute('/dashboard/support')({
  head: () => ({ meta: [
    { title: 'Support — Dashboard — Gigvora' },
    { name: 'description', content: 'Help, tickets, and live support across Gigvora.' },
  ]}),
  component: () => <DashboardSupportPage />,
});
