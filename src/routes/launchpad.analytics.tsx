import { createFileRoute } from '@tanstack/react-router';
import LaunchpadAnalyticsPage from '@/pages/launchpad/LaunchpadAnalyticsPage';
export const Route = createFileRoute('/launchpad/analytics')({
  head: () => ({ meta: [{ title: 'Analytics — Launchpad' }, { name: 'description', content: 'Your launchpad progress and analytics.' }]}),
  component: () => <LaunchpadAnalyticsPage />,
});
