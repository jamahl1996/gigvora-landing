import { createFileRoute } from '@tanstack/react-router';
import PodcastAnalyticsPage from '@/pages/podcasts/PodcastAnalyticsPage';
export const Route = createFileRoute('/podcasts/analytics')({
  head: () => ({ meta: [{ title: 'Podcast Analytics — Gigvora' }, { name: 'description', content: 'Analyze your podcast performance.' }]}),
  component: () => <PodcastAnalyticsPage />,
});
