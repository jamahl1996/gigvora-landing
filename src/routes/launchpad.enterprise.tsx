import { createFileRoute } from '@tanstack/react-router';
import LaunchpadEnterprisePage from '@/pages/launchpad/LaunchpadEnterprisePage';
export const Route = createFileRoute('/launchpad/enterprise')({
  head: () => ({ meta: [{ title: 'Enterprise — Launchpad' }, { name: 'description', content: 'Enterprise launchpad partner programs.' }]}),
  component: () => <LaunchpadEnterprisePage />,
});
