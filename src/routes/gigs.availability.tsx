import { createFileRoute } from '@tanstack/react-router';
import SellerAvailabilityPage from '@/pages/gigs/SellerAvailabilityPage';
export const Route = createFileRoute('/gigs/availability')({
  head: () => ({ meta: [{ title: 'Seller Availability — Gigs' }, { name: 'description', content: 'Set capacity, vacation mode, and queue limits for incoming orders.' }]}),
  component: () => <SellerAvailabilityPage />,
});
