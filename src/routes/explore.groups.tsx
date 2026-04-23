import { createFileRoute } from '@tanstack/react-router';
import GroupsSearchPage from '@/pages/explore/GroupsSearchPage';
export const Route = createFileRoute('/explore/groups')({
  head: () => ({ meta: [{ title: 'Groups Search — Gigvora' }, { name: 'description', content: 'Find professional groups and communities.' }]}),
  component: () => <GroupsSearchPage />,
});
