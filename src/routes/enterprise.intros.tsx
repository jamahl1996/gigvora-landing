import { createFileRoute } from '@tanstack/react-router';
import EnterpriseIntrosPage from '@/pages/enterprise/EnterpriseIntrosPage';
export const Route = createFileRoute('/enterprise/intros')({
  head: () => ({ meta: [{ title: 'Enterprise Intros — Gigvora' }, { name: 'description', content: 'Warm introductions across the Gigvora enterprise network.' }]}),
  component: () => <EnterpriseIntrosPage />,
});
