import { createFileRoute } from '@tanstack/react-router';
import FollowingHubPage from '@/pages/networking/FollowingHubPage';
export const Route = createFileRoute('/networking/following')({
  head: () => ({ meta: [{ title: 'Following — Networking — Gigvora' }, { name: 'description', content: 'People and organizations you follow on Gigvora.' }]}),
  component: () => <FollowingHubPage />,
});
