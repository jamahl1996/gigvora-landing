import { createFileRoute } from '@tanstack/react-router';
import LaunchpadEventsPage from '@/pages/launchpad/LaunchpadEventsPage';
export const Route = createFileRoute('/launchpad/events')({
  head: () => ({ meta: [{ title: 'Events — Launchpad' }, { name: 'description', content: 'Career events for early-career talent.' }]}),
  component: () => <LaunchpadEventsPage />,
});
