import { createFileRoute } from '@tanstack/react-router';
import GigPromotionsPage from '@/pages/gigs/GigPromotionsPage';
export const Route = createFileRoute('/gigs/promotions')({
  head: () => ({ meta: [{ title: 'Gig Promotions — Gigvora' }, { name: 'description', content: 'Discounts, coupons, and featured placement for your gigs.' }]}),
  component: () => <GigPromotionsPage />,
});
