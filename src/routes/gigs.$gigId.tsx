import { createFileRoute } from '@tanstack/react-router';
import GigDetailPage from '@/pages/gigs/GigDetailPage';
export const Route = createFileRoute('/gigs/$gigId')({
  head: () => ({ meta: [{ title: 'Gig Details — Gigvora' }, { name: 'description', content: 'View gig packages, reviews, and seller details.' }]}),
  component: () => <GigDetailPage />,
});
