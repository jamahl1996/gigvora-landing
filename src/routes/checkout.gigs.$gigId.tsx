import { createFileRoute } from '@tanstack/react-router';
import GigCheckoutPage from '@/pages/checkout/GigCheckoutPage';
export const Route = createFileRoute('/checkout/gigs/$gigId')({
  head: () => ({ meta: [{ title: 'Checkout — Gig' }, { name: 'description', content: 'Complete your gig purchase.' }]}),
  component: () => <GigCheckoutPage />,
});
