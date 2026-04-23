import { createFileRoute } from '@tanstack/react-router';
import PricingPage from '@/pages/PricingPage';

export const Route = createFileRoute('/pricing')({
  head: () => ({
    meta: [
      { title: 'Pricing — Gigvora' },
      { name: 'description', content: 'Transparent pricing for Free, Pro, Team, and Enterprise plans. Pay only for what you use across hiring, gigs, projects, and ads.' },
      { property: 'og:title', content: 'Pricing — Gigvora' },
      { property: 'og:description', content: 'Free, Pro, Team, and Enterprise plans for the Gigvora platform.' },
    ],
  }),
  component: () => <PricingPage />,
});