import { createFileRoute } from '@tanstack/react-router';
import CommunityGroupsPage from '@/pages/community/CommunityGroupsPage';
export const Route = createFileRoute('/community/groups')({
  head: () => ({ meta: [{ title: 'Community Groups — Gigvora' }, { name: 'description', content: 'Discover and join professional communities and interest groups.' }]}),
  component: () => <CommunityGroupsPage />,
});
