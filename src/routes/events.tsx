import { createFileRoute } from '@tanstack/react-router';
import EventsDiscoveryPage from '@/pages/events/EventsDiscoveryPage';
export const Route = createFileRoute('/events')({
  head: () => ({ meta: [{ title: 'Events — Gigvora' }, { name: 'description', content: 'Discover live events, summits, and webinars across Gigvora.' }]}),
  component: () => <EventsDiscoveryPage />,
});
