import { createFileRoute } from '@tanstack/react-router';
import PodcastSubscriptionsPage from '@/pages/podcasts/PodcastSubscriptionsPage';
export const Route = createFileRoute('/podcasts/subscriptions')({
  head: () => ({ meta: [{ title: 'Subscriptions — Gigvora' }, { name: 'description', content: 'Your podcast subscriptions.' }]}),
  component: () => <PodcastSubscriptionsPage />,
});
