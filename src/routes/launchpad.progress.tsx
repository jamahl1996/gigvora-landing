import { createFileRoute } from '@tanstack/react-router';
import LaunchpadProgressTrackerPage from '@/pages/launchpad/LaunchpadProgressTrackerPage';
export const Route = createFileRoute('/launchpad/progress')({
  head: () => ({ meta: [{ title: 'Progress — Launchpad' }, { name: 'description', content: 'Track your launchpad progress over time.' }]}),
  component: () => <LaunchpadProgressTrackerPage />,
});
