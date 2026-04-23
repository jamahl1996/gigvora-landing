import { createFileRoute } from '@tanstack/react-router';
import PodcastQueuePage from '@/pages/podcasts/PodcastQueuePage';
export const Route = createFileRoute('/podcasts/queue')({
  head: () => ({ meta: [{ title: 'Queue — Gigvora' }, { name: 'description', content: 'Your up-next podcast episode queue.' }]}),
  component: () => <PodcastQueuePage />,
});
