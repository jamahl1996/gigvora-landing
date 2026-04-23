import { createFileRoute } from '@tanstack/react-router';
import GroupDetailPage from '@/pages/groups/GroupDetailPage';
export const Route = createFileRoute('/groups/$groupId')({
  head: () => ({ meta: [{ title: 'Group — Gigvora' }, { name: 'description', content: 'Group details, members, and discussion.' }]}),
  component: () => <GroupDetailPage />,
});
