import { createFileRoute } from '@tanstack/react-router';
import EventsSearchPage from '@/pages/explore/EventsSearchPage';
export const Route = createFileRoute('/explore/events')({
  head: () => ({ meta: [{ title: 'Events Search — Gigvora' }, { name: 'description', content: 'Discover live and online events worldwide.' }]}),
  component: () => <EventsSearchPage />,
});
