import { createFileRoute } from '@tanstack/react-router';
import PodcastsSearchPage from '@/pages/explore/PodcastsSearchPage';
export const Route = createFileRoute('/explore/podcasts')({
  head: () => ({ meta: [{ title: 'Podcasts Search — Gigvora' }, { name: 'description', content: 'Discover podcast shows and episodes.' }]}),
  component: () => <PodcastsSearchPage />,
});
