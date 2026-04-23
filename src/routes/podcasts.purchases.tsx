import { createFileRoute } from '@tanstack/react-router';
import PodcastPurchasesPage from '@/pages/podcasts/PodcastPurchasesPage';
export const Route = createFileRoute('/podcasts/purchases')({
  head: () => ({ meta: [{ title: 'Purchases — Gigvora' }, { name: 'description', content: 'Your purchased podcast content.' }]}),
  component: () => <PodcastPurchasesPage />,
});
