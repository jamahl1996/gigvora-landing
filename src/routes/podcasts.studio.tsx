import { createFileRoute } from '@tanstack/react-router';
import PodcastCreatorStudioPage from '@/pages/podcasts/PodcastCreatorStudioPage';
export const Route = createFileRoute('/podcasts/studio')({
  head: () => ({ meta: [{ title: 'Podcast Studio — Gigvora' }, { name: 'description', content: 'Create and manage your podcast shows.' }]}),
  component: () => <PodcastCreatorStudioPage />,
});
