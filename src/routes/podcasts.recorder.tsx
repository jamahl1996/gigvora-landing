import { createFileRoute } from '@tanstack/react-router';
import PodcastRecorderPage from '@/pages/podcasts/PodcastRecorderPage';
export const Route = createFileRoute('/podcasts/recorder')({
  head: () => ({ meta: [{ title: 'Recorder — Gigvora' }, { name: 'description', content: 'Record podcast episodes in-browser.' }]}),
  component: () => <PodcastRecorderPage />,
});
