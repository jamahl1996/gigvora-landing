import { createFileRoute } from '@tanstack/react-router';
import LaunchpadHomePage from '@/pages/launchpad/LaunchpadHomePage';
export const Route = createFileRoute('/launchpad')({
  head: () => ({ meta: [{ title: 'Launchpad — Gigvora' }, { name: 'description', content: 'Career launchpad for graduates, school leavers, and changers.' }]}),
  component: () => <LaunchpadHomePage />,
});
