import { createFileRoute } from '@tanstack/react-router';
import DashboardSettingsPage from '@/pages/dashboard/DashboardSettingsPage';

export const Route = createFileRoute('/dashboard/settings')({
  head: () => ({ meta: [
    { title: 'Settings — Dashboard — Gigvora' },
    { name: 'description', content: 'Configure your Gigvora dashboard preferences.' },
  ]}),
  component: () => <DashboardSettingsPage />,
});