import { createFileRoute } from '@tanstack/react-router';
import PodcastLibraryPage from '@/pages/podcasts/PodcastLibraryPage';
export const Route = createFileRoute('/podcasts/library')({
  head: () => ({ meta: [{ title: 'Podcast Library — Gigvora' }, { name: 'description', content: 'Your saved podcast shows and episodes.' }]}),
  component: () => <PodcastLibraryPage />,
});
