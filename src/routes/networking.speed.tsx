import { createFileRoute } from '@tanstack/react-router';
import SpeedNetworkingLobbyPage from '@/pages/networking/SpeedNetworkingLobbyPage';
export const Route = createFileRoute('/networking/speed')({
  head: () => ({ meta: [{ title: 'Speed Networking — Gigvora' }, { name: 'description', content: 'Curated 1:1 speed-networking sessions with matched peers.' }]}),
  component: () => <SpeedNetworkingLobbyPage />,
});
