import { createFileRoute } from '@tanstack/react-router';
import PodcastDiscoveryPage from '@/pages/podcasts/PodcastDiscoveryPage';
export const Route = createFileRoute('/podcasts')({
  head: () => ({ meta: [{ title: 'Podcasts — Gigvora' }, { name: 'description', content: 'Discover podcast shows and episodes.' }]}),
  component: () => <PodcastDiscoveryPage />,
});
