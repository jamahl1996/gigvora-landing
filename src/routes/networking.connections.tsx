import { createFileRoute } from '@tanstack/react-router';
import ConnectionsHubPage from '@/pages/networking/ConnectionsHubPage';
export const Route = createFileRoute('/networking/connections')({
  head: () => ({ meta: [{ title: 'Connections — Networking — Gigvora' }, { name: 'description', content: 'Your full network and relationship intelligence.' }]}),
  component: () => <ConnectionsHubPage />,
});
