import { createFileRoute } from '@tanstack/react-router';
import EnterpriseDashboardPage from '@/pages/enterprise/EnterpriseDashboardPage';
export const Route = createFileRoute('/enterprise/dashboard')({
  head: () => ({ meta: [{ title: 'Enterprise Dashboard — Gigvora' }, { name: 'description', content: 'Operating cockpit for enterprise teams across hiring, spend, and partnerships.' }]}),
  component: () => <EnterpriseDashboardPage />,
});
