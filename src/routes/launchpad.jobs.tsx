import { createFileRoute } from '@tanstack/react-router';
import LaunchpadJobsPage from '@/pages/launchpad/LaunchpadJobsPage';
export const Route = createFileRoute('/launchpad/jobs')({
  head: () => ({ meta: [{ title: 'Jobs — Launchpad' }, { name: 'description', content: 'Entry-level and graduate jobs.' }]}),
  component: () => <LaunchpadJobsPage />,
});
