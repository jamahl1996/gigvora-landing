import { createFileRoute } from '@tanstack/react-router';
import ShowcasePodcastsPage from '@/pages/showcase/ShowcasePodcastsPage';

export const Route = createFileRoute('/showcase/podcasts')({
  head: () => ({ meta: [
    { title: 'Podcasts — Gigvora' },
    { name: 'description', content: 'Discover and publish podcasts on Gigvora.' },
    { property: 'og:title', content: 'Podcasts — Gigvora' },
    { property: 'og:description', content: 'Audio shows from the Gigvora community.' },
  ]}),
  component: () => <ShowcasePodcastsPage />,
});