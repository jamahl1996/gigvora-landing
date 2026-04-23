import { createFileRoute } from '@tanstack/react-router';
import LaunchpadDiscoverPage from '@/pages/launchpad/LaunchpadDiscoverPage';
export const Route = createFileRoute('/launchpad/discover')({
  head: () => ({ meta: [{ title: 'Discover — Launchpad' }, { name: 'description', content: 'Discover programs, opportunities, and pathways.' }]}),
  component: () => <LaunchpadDiscoverPage />,
});
