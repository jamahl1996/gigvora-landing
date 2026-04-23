import { createFileRoute } from '@tanstack/react-router';
import LaunchpadHostsPage from '@/pages/launchpad/LaunchpadHostsPage';
export const Route = createFileRoute('/launchpad/hosts')({
  head: () => ({ meta: [{ title: 'Hosts — Launchpad' }, { name: 'description', content: 'Organizations hosting launchpad programs.' }]}),
  component: () => <LaunchpadHostsPage />,
});
