import { createFileRoute } from '@tanstack/react-router';
import LaunchpadCommunityPage from '@/pages/launchpad/LaunchpadCommunityPage';
export const Route = createFileRoute('/launchpad/community')({
  head: () => ({ meta: [{ title: 'Community — Launchpad' }, { name: 'description', content: 'Connect with peers in the launchpad community.' }]}),
  component: () => <LaunchpadCommunityPage />,
});
