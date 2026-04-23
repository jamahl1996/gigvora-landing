import { createFileRoute } from '@tanstack/react-router';
import GigPricingIntelPage from '@/pages/gigs/GigPricingIntelPage';
export const Route = createFileRoute('/gigs/pricing-intel')({
  head: () => ({ meta: [{ title: 'Pricing Intelligence — Gigs' }, { name: 'description', content: 'Benchmark gig pricing against the market in real time.' }]}),
  component: () => <GigPricingIntelPage />,
});
