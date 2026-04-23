import { createFileRoute } from '@tanstack/react-router';
import EnterpriseProfilePage from '@/pages/enterprise/EnterpriseProfilePage';
export const Route = createFileRoute('/enterprise/profile')({
  head: () => ({ meta: [{ title: 'Enterprise Profile — Gigvora' }, { name: 'description', content: 'Manage your organization profile and enterprise presence.' }]}),
  component: () => <EnterpriseProfilePage />,
});
