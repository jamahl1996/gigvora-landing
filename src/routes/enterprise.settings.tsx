import { createFileRoute } from '@tanstack/react-router';
import EnterpriseConnectSettingsPage from '@/pages/enterprise/EnterpriseConnectSettingsPage';
export const Route = createFileRoute('/enterprise/settings')({
  head: () => ({ meta: [{ title: 'Enterprise Settings — Gigvora' }, { name: 'description', content: 'Configure enterprise networking, visibility, and team permissions.' }]}),
  component: () => <EnterpriseConnectSettingsPage />,
});
