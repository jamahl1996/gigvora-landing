import { createFileRoute } from '@tanstack/react-router';
import EnterpriseConnectHomePage from '@/pages/enterprise/EnterpriseConnectHomePage';
export const Route = createFileRoute('/enterprise')({
  head: () => ({ meta: [{ title: 'Enterprise Connect — Gigvora' }, { name: 'description', content: 'B2B partnerships, procurement intel, and enterprise networking.' }]}),
  component: () => <EnterpriseConnectHomePage />,
});
