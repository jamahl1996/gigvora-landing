import { createFileRoute } from '@tanstack/react-router';
import PodcastDonationsPage from '@/pages/podcasts/PodcastDonationsPage';
export const Route = createFileRoute('/podcasts/donations')({
  head: () => ({ meta: [{ title: 'Donations — Gigvora' }, { name: 'description', content: 'Donations to support podcasts you love.' }]}),
  component: () => <PodcastDonationsPage />,
});
