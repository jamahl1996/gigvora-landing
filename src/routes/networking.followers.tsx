import { createFileRoute } from '@tanstack/react-router';
import FollowersHubPage from '@/pages/networking/FollowersHubPage';
export const Route = createFileRoute('/networking/followers')({
  head: () => ({ meta: [{ title: 'Followers — Networking — Gigvora' }, { name: 'description', content: 'Manage your followers and audience across Gigvora.' }]}),
  component: () => <FollowersHubPage />,
});
