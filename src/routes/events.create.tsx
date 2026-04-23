import { createFileRoute } from '@tanstack/react-router';
import EventCreatePage from '@/pages/events/EventCreatePage';
export const Route = createFileRoute('/events/create')({
  head: () => ({ meta: [{ title: 'Create Event — Gigvora' }, { name: 'description', content: 'Host a new event, summit, or webinar in 10 enterprise-grade steps.' }]}),
  component: () => <EventCreatePage />,
});
