import { createFileRoute } from '@tanstack/react-router';
import PodcastsPage from '@/pages/podcasts/PodcastsPage';
export const Route = createFileRoute('/podcasts/legacy')({
  head: () => ({ meta: [{ title: 'Podcasts (Legacy) — Gigvora' }, { name: 'description', content: 'Legacy podcasts experience.' }]}),
  component: () => <PodcastsPage />,
});
