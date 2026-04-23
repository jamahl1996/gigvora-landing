import { createFileRoute } from '@tanstack/react-router';
import PodcastSeriesPage from '@/pages/podcasts/PodcastSeriesPage';
export const Route = createFileRoute('/podcasts/series')({
  head: () => ({ meta: [{ title: 'Series — Gigvora' }, { name: 'description', content: 'Browse curated podcast series.' }]}),
  component: () => <PodcastSeriesPage />,
});
