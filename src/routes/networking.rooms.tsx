import { createFileRoute } from '@tanstack/react-router';
import NetworkingRoomsLobbyPage from '@/pages/networking/NetworkingRoomsLobbyPage';
export const Route = createFileRoute('/networking/rooms')({
  head: () => ({ meta: [{ title: 'Networking Rooms — Gigvora' }, { name: 'description', content: 'Live audio and video rooms for high-signal networking.' }]}),
  component: () => <NetworkingRoomsLobbyPage />,
});
