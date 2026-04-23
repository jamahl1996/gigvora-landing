import { createFileRoute } from '@tanstack/react-router';
import GroupsHubPage from '@/pages/groups/GroupsHubPage';
export const Route = createFileRoute('/groups')({
  head: () => ({ meta: [{ title: 'Groups — Gigvora' }, { name: 'description', content: 'Discover and manage professional groups across Gigvora.' }]}),
  component: () => <GroupsHubPage />,
});
