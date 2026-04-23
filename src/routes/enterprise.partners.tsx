import { createFileRoute } from '@tanstack/react-router';
import EnterprisePartnerDiscoveryPage from '@/pages/enterprise/EnterprisePartnerDiscoveryPage';
export const Route = createFileRoute('/enterprise/partners')({
  head: () => ({ meta: [{ title: 'Partner Discovery — Enterprise — Gigvora' }, { name: 'description', content: 'Discover and qualify potential enterprise partners.' }]}),
  component: () => <EnterprisePartnerDiscoveryPage />,
});
