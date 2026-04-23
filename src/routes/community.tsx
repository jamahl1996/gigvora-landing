import { createFileRoute } from '@tanstack/react-router';
import { GroupsPage } from '@/pages/community/CommunityPages';
export const Route = createFileRoute('/community')({
  head: () => ({ meta: [{ title: 'Community — Gigvora' }, { name: 'description', content: 'Community spaces, groups, and cohorts across Gigvora.' }]}),
  component: () => <GroupsPage />,
});
