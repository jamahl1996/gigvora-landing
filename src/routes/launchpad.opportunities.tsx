import { createFileRoute } from '@tanstack/react-router';
import LaunchpadOpportunitiesPage from '@/pages/launchpad/LaunchpadOpportunitiesPage';
export const Route = createFileRoute('/launchpad/opportunities')({
  head: () => ({ meta: [{ title: 'Opportunities — Launchpad' }, { name: 'description', content: 'Browse early-career opportunities.' }]}),
  component: () => <LaunchpadOpportunitiesPage />,
});
