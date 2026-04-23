import { createFileRoute } from '@tanstack/react-router';
import LaunchpadApplicationsPage from '@/pages/launchpad/LaunchpadApplicationsPage';
export const Route = createFileRoute('/launchpad/applications')({
  head: () => ({ meta: [{ title: 'Applications — Launchpad' }, { name: 'description', content: 'Track your launchpad applications.' }]}),
  component: () => <LaunchpadApplicationsPage />,
});
