import { createFileRoute } from '@tanstack/react-router';
import PodcastPlayerPage from '@/pages/podcasts/PodcastPlayerPage';
export const Route = createFileRoute('/podcasts/player')({
  head: () => ({ meta: [{ title: 'Podcast Player — Gigvora' }, { name: 'description', content: 'Play podcast episodes with full controls.' }]}),
  component: () => <PodcastPlayerPage />,
});
