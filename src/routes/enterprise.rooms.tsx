import { createFileRoute } from '@tanstack/react-router';
import EnterpriseRoomsPage from '@/pages/enterprise/EnterpriseRoomsPage';
export const Route = createFileRoute('/enterprise/rooms')({
  head: () => ({ meta: [{ title: 'Enterprise Rooms — Gigvora' }, { name: 'description', content: 'Private rooms for enterprise discussions and deal flow.' }]}),
  component: () => <EnterpriseRoomsPage />,
});
