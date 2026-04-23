import { createFileRoute } from '@tanstack/react-router';
import SellerPerformancePage from '@/pages/gigs/SellerPerformancePage';
export const Route = createFileRoute('/gigs/performance')({
  head: () => ({ meta: [{ title: 'Seller Performance — Gigs' }, { name: 'description', content: 'On-time delivery, response, and rating performance metrics.' }]}),
  component: () => <SellerPerformancePage />,
});
