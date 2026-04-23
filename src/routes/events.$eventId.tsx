import { createFileRoute } from '@tanstack/react-router';
import EventLobbyPage from '@/pages/events/EventLobbyPage';
export const Route = createFileRoute('/events/$eventId')({
  head: () => ({ meta: [{ title: 'Event Lobby — Gigvora' }, { name: 'description', content: 'Event lobby with sessions and agenda.' }]}),
  component: () => <EventLobbyPage />,
});
